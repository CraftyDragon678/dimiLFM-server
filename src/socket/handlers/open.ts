import { SocketEventHandler } from '.';
import { Founds, Losts, Markets } from '../../models/boardModel';
import { Chats } from '../../models/chatModel';
import * as redis from '../../redis';

export default {
  event: 'open',
  listener(msg: { id: string, board: 'found' | 'lost' | 'market' }) {
    (async () => {
      const client = await redis.hgetall(`client/${this.id}`);
      // eslint-disable-next-line no-nested-ternary
      const article = msg.board === 'found'
        ? await Founds.findById(msg.id)
        : msg.board === 'lost' // eslint-disable-line no-nested-ternary
          ? await Losts.findById(msg.id)
          : msg.board === 'market'
            ? await Markets.findById(msg.id)
            : null;
      if (!article) return;

      await Chats.create({
        from: client.oid,
        to: article.user,
        refBoardType: msg.board,
        ref: msg.id,
        messages: [],
      });
      this.emit('open', true);
    })();
  },
} as SocketEventHandler;
