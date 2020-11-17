import { Router } from 'express';
import WebSocket from 'ws';
import { ISocket } from '../../types/socket';

const router = Router();

const wss = new WebSocket.Server({ noServer: true });

const clients = new Set<ISocket>();

export const sendTo = (ws: WebSocket | number, msg: string): void => {
  if (ws instanceof WebSocket) {
    [...clients.values()].find((e) => e.socket === ws)?.socket.send(msg);
  } else {
    [...clients.values()].filter((e) => e.id === ws).map(({ socket }) => socket.send(msg));
  }
};

function onSocketConnect(id: number) {
  return (_ws: WebSocket) => {
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

// TODO 굳이 8080 포트 아니여도 되는데,,
// 상관은 없따
router.get('/', (req) => {
  // 30초 짜리 토큰 처리

  console.log("socket in");
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect(2555));
});

export default router;
