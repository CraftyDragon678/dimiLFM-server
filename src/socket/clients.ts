import { Socket } from 'socket.io';

interface Client {
  socket: Socket;
  oid: number;
}

const clients: { [key: string]: Client } = {};

export const add = (socket: Socket, oid: number): void => {
  clients[socket.id] = { socket, oid };
};

export const get = (oid: number): Socket => (
  clients[Object.keys(clients).find((id) => clients[id].oid === oid) || '']?.socket
);

export const getAll = (oid: number): Socket[] => (
  Object.keys(clients).filter((id) => clients[id].oid === oid)
    .map((id) => clients[id].socket)
);

export const getOid = (socket: Socket): number => (
  clients[Object.keys(clients).find((id) => clients[id].socket === socket) || '']?.oid
);

export const del: {
  (id: string): void;
  (socket: Socket): void;
} = (socket: Socket | string) => {
  if (typeof socket === 'string') {
    delete clients[socket];
  } else {
    delete clients[Object.keys(clients).find((id) => clients[id].socket === socket) || ''];
  }
};
