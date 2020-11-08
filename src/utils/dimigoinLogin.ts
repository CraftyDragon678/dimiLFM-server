import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { IIdentity } from '../types/dimigo';

const loginAsDimigoIn = async (id: string, password: string): Promise<IIdentity | undefined> => {
  const { token }: { token: string } = await (await fetch('https://dev-api.dimigo.in/auth/', {
    method: 'POST',
    body: JSON.stringify({ id, password }),
    headers: {
      'content-type': 'application/json',
    },
  })).json();
  const payload = jwt.decode(token) as { identity: IIdentity[] } | null;
  return payload?.identity[0];
};

export default loginAsDimigoIn;
