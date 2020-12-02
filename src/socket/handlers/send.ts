import { SocketEventHandler } from '.';
import * as clients from '../clients';
import { Chats } from '../../models/chatModel';

export default {
  event: 'send',
  listener(msg: { channel: string, type: string, message: string }) {
    if (!msg.message.trim()) return;
    (async () => {
      const channel = await Chats.findById(msg.channel);
      if (!channel) {
        this.emit('send', false);
        return;
      }
      const isFrom = channel.from === clients.getOid(this);

      await Chats.findByIdAndUpdate(msg.channel, {
        $push: {
          messages: {
            from: isFrom,
            message: msg.message,
            type: msg.type,
          },
        },
      });

      clients.getAll((isFrom ? channel.to : channel.from) as number).forEach((socket) => {
        socket.emit('message', {
          type: msg.type,
          channel: msg.channel,
          message: msg.message,
          date: new Date(),
        });
      });
      clients.getAll((isFrom ? channel.from : channel.to) as number).forEach((socket) => {
        if (socket === this) return;
        socket.emit('message', {
          mine: true,
          type: msg.type,
          channel: msg.channel,
          message: msg.message,
          date: new Date(),
        });
      });
      this.emit('send', true);
    })();
  },
} as SocketEventHandler;
