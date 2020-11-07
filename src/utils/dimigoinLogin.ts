import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const loginAsDimigoIn = async (id: string, password: string) => {
  const { token }: { token: string } = await (await fetch('https://dev-api.dimigo.in/auth/', {
    method: 'POST',
    body: JSON.stringify({id, password}),
    headers: {
      'content-type': 'application/json',
    },
  })).json();
  const payload = jwt.decode(token) as { identity: IIdentity[] };
  return payload.identity[0];
}

export default loginAsDimigoIn;
