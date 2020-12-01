import { Socket } from 'socket.io';
import open from './open';
import send from './send';

export interface SocketEventHandler {
  event: string | symbol;
  listener: (this: Socket, ...args: unknown[]) => void;
}

export default [
  send,
  open,
] as SocketEventHandler[];
