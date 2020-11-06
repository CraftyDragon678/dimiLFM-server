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
  return jwt.decode(token)?.identity[0];
}

export default loginAsDimigoIn;
