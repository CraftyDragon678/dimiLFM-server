import { SocketEventHandler } from '.';
import * as redis from '../../redis';

export default {
  event: 'send',
  listener(msg: { type: string, message: string }) {
    if (!msg.message.trim()) return;
    (async () => {
      const client = await redis.hgetall(`client/${this.id}`);
      this.broadcast.emit('message', `${client.name}: ${msg.message}`, new Date());
      this.emit('send', true);
    })();
  },
} as SocketEventHandler;
