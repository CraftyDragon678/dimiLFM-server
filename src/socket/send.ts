import * as clients from './clients';

const sendToChannel = ({
  me, other, type, channel, message, date = new Date(),
}: {
  me: number,
  other: number,
  type: string,
  channel: string,
  message: string,
  date?: Date,
}): void => {
  clients.getAll(other).forEach((socket) => {
    socket.emit('message', {
      type,
      channel,
      message,
      date,
    });
  });
  clients.getAll(me).forEach((socket) => {
    if (socket === this) return;
    socket.emit('message', {
      mine: true,
      type,
      channel,
      message,
      date,
    });
  });
};

export default sendToChannel;
