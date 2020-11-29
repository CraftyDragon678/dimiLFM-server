import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import WebSocket from 'ws';
import Users from '../../models/userModel';
import * as redisClient from '../../redis';
import { ISocket } from '../../types/socket';

const router = Router();

const wss = new WebSocket.Server({ noServer: true });

const clients = new Set<ISocket>();

export const sendTo = (ws: WebSocket | number, msg: unknown): void => {
  if (ws instanceof WebSocket) {
    [...clients.values()].find((e) => e.socket === ws)?.socket.send(msg);
  } else {
    [...clients.values()].filter((e) => e.id === ws).map(({ socket }) => socket.send(msg));
  }
};

export const sendToAll = (msg: unknown): void => {
  [...clients.values()].forEach((e) => e.socket.send(msg));
};

export const sendToOthers = (ws: WebSocket | number, msg: unknown): void => {
  if (ws instanceof WebSocket) {
    [...clients.values()].filter((e) => e.socket !== ws).map(({ socket }) => socket.send(msg));
  } else {
    [...clients.values()].filter((e) => e.id !== ws).map(({ socket }) => socket.send(msg));
  }
};

function onSocketConnect(id: number, name: string) {
  return async (_ws: WebSocket) => {
    const ws: ISocket = {
      id,
      name,
      socket: _ws,
    };

    clients.add(ws);

    ws.socket.on('message', (msg) => {
      sendToAll(`${ws.name}: ${msg}`);
    });

    ws.socket.on('close', () => clients.delete(ws));
  };
}

router.get('/', expressAsyncHandler(async (req, res) => {
  const { oid, token } = req.query;
  if (!oid || !token) return res.status(400).send();
  const data = await redisClient.hgetall(`socket/${oid}`);
  if (new Date().getTime() > +data.exp) {
    return res.status(401).json({ message: 'token has been expired' });
  }
  if (data.token !== token) {
    return res.status(401).json({ message: 'incorrect token' });
  }
  const user = await Users.findById(+oid);
  if (user) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect(+oid, user.name));
  }
}));

export default router;
