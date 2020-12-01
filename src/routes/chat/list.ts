import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Chats } from '../../models/chatModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const result = await Chats.find().or([
    { from: req.auth.oid },
    { to: req.auth.oid },
  ]).select('messages from to')
    .where('messages')
    .slice(-1)
    .lean();

  return res.json(result.map(({ messages, ...e }) => ({ ...e, lastMessage: messages[0] })));
}));

export default router;
