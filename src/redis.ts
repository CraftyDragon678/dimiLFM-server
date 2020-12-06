import redis from 'redis';

const redisClient = redis.createClient({
  host: 'redis',
});

interface Hash {
  [key: string]: string | number;
}

export const hmset = (key: string, obj: Hash): Promise<'OK'> => (
  new Promise((resolve, reject) => {
    redisClient.hmset(key, obj, (err, reply) => {
      if (err) reject(err);
      else resolve(reply);
    });
  })
);

export const hgetall = (key: string): Promise<Hash> => (
  new Promise((resolve, reject) => {
    redisClient.hgetall(key, (err, reply) => {
      if (err) reject(err);
      else resolve(reply);
    });
  })
);

export const del = (key: string | string[]): Promise<number> => (
  new Promise((resolve, reject) => {
    redisClient.del(key, (err, reply) => {
      if (err) reject(err);
      else resolve(reply);
    });
  })
);

export default redisClient;
