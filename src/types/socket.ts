import WebSocket from 'ws';

export interface ISocket {
  socket: WebSocket;
  id: number;
}
