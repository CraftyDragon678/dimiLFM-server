import { Socket } from 'socket.io';
import send from './send';

export interface SocketEventHandler {
  event: string | symbol;
  listener: (this: Socket, ...args: unknown[]) => void;
}

export default [
  send,
] as SocketEventHandler[];
