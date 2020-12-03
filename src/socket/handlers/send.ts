import { SocketEventHandler } from '.';
import * as clients from '../clients';
import { Chats } from '../../models/chatModel';
import sendToChannel from '../send';

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

      sendToChannel({
        me: (isFrom ? channel.from : channel.to) as number,
        other: (isFrom ? channel.to : channel.from) as number,
        channel: msg.channel,
        message: msg.message,
        type: msg.type,
      });
      this.emit('send', true);
    })();
  },
} as SocketEventHandler;
