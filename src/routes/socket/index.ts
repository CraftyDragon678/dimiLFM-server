import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import WebSocket from 'ws';
import * as redisClient from '../../redis';
import { ISocket } from '../../types/socket';

const router = Router();

const wss = new WebSocket.Server({ noServer: true });

const clients = new Set<ISocket>();

export const sendTo = (ws: WebSocket | number, msg: any): void => {
  if (ws instanceof WebSocket) {
    [...clients.values()].find((e) => e.socket === ws)?.socket.send(msg);
  } else {
    [...clients.values()].filter((e) => e.id === ws).map(({ socket }) => socket.send(msg));
  }
};

export const sendToAll = (msg: any): void => {
  [...clients.values()].forEach((e) => e.socket.send(msg));
}

export const sendOthers = (ws: WebSocket | number, msg: any): void => {
  if (ws instanceof WebSocket) {
    [...clients.values()].filter((e) => e.socket !== ws).map(({ socket }) => socket.send(msg));
  } else {
    [...clients.values()].filter((e) => e.id !== ws).map(({ socket }) => socket.send(msg));
  }
}

    const ws: ISocket = {
      id,
      socket: _ws,
    };

    clients.add(ws);

    ws.socket.on('message', (msg) => {
      console.log(`MSG: ${msg}`);
    });

    ws.socket.on('close', () => clients.delete(ws));
  };
}

router.get('/', expressAsyncHandler(async (req, res) => {
  const { oid, token } = req.query;
  const data = await redisClient.hgetall(`socket/${oid}`);
  if (new Date().getTime() > +data.exp) {
    res.status(401).send();
    return;
  }
  if (data.token === token) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect(2555));
    return;
  }
  res.status(401).send();
}));

export default router;
