import socketio, { Socket } from 'socket.io';
import Users from '../models/userModel';
import * as redisClient from '../redis';
import { corsAllow } from '../../config.json';
import handlers from './handlers';
import * as clients from './clients';

const io = new socketio.Server({
  serveClient: false,
  cookie: true,
  cors: {
    origin: corsAllow,
  },
});

interface QueryPayload {
  token: string;
  oid: string;
}

io.use((socket, next) => {
  (async () => {
    const { query } = socket.handshake as { query: QueryPayload };
    if (!(query && query.token && query.oid)) {
      socket.disconnect();
      return next(new Error('Authentication error'));
    }
    const { oid, token } = query;

    const data = await redisClient.hgetall(`socket/${oid}`);
    if (new Date().getTime() > +data.exp) {
      socket.disconnect();
      return next(new Error('Token expired'));
    }
    if (data.token !== token) {
      socket.disconnect();
      return next(new Error('Token incorrect'));
    }
    const user = await Users.findById(+oid);
    if (user) {
      clients.add(socket, +oid);
      return next();
    }
    socket.disconnect();
    return next(new Error('Unknown error'));
  })();
});

io.on('connection', (socket: Socket) => {
  handlers.forEach((handler) => {
    socket.on(handler.event, handler.listener.bind(socket));
  });

  socket.on('disconnect', () => {
    clients.del(socket.id);
  });
});

export default io;
