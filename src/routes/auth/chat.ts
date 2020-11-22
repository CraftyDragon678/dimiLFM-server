import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';
import redis from '../../redis';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + 30);
  now.getTime();

  const token = crypto.randomBytes(64).toString('base64');

  redis.hmset(`socket/${req.auth.oid}`, {
    token,
    exp: now.getTime(),
  });
  res.json({ token, exp: now.getTime(), oid: req.auth.oid });
}));

export default router;
