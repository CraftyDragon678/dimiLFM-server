import { SocketEventHandler } from '.';

export default {
  event: 'send',
  listener(msg: { type: string, message: string }) {
    this.broadcast.emit('message', msg.message);
    this.emit('send', 'ok');
  },
} as SocketEventHandler;
