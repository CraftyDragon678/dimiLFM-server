import { SocketEventHandler } from '.';
import { Founds, Losts, Markets } from '../../models/boardModel';
import { Chats } from '../../models/chatModel';
import * as redis from '../../redis';

export default {
  event: 'open',
  listener(msg: { id: string, board: 'found' | 'lost' | 'market' }) {
    (async () => {
      const client = await redis.hgetall(`client/${this.id}`);
      if (msg.board === 'found') {
        if (!await Founds.findById(msg.id)) return;
      } else if (msg.board === 'lost') {
        if (!await Losts.findById(msg.id)) return;
      } else if (msg.board === 'market') {
        if (!await Markets.findById(msg.id)) return;
      } else return;

      await Chats.create({
        from: client.oid,
        refBoardType: msg.board,
        ref: msg.id,
        messages: [],
      });
      this.emit('open', true);
    })();
  },
} as SocketEventHandler;
