import { SocketEventHandler } from '.';
import * as redis from '../../redis';

export default {
  event: 'send',
  listener(msg: { type: string, message: string }) {
    (async () => {
      const client = await redis.hgetall(`client/${this.id}`);
      this.broadcast.emit('message', `${client.name}: ${msg.message}`);
      this.emit('send', 'ok');
    })();
  },
} as SocketEventHandler;
