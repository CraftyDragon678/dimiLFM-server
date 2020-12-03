import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Chats, IChatPopulated } from '../../models/chatModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const result: IChatPopulated[] = await Chats.find().or([
    { from: req.auth.oid },
    { to: req.auth.oid },
  ])
    .where('messages')
    .slice(-1)
    .populate('from', 'serial type name profileimage')
    .populate('to', 'serial type name profileimage')
    .populate('ref', 'title')
    .sort('-updatedAt')
    .lean();

  return res.json(result.map(({
    _id, messages, from, to, ref,
  }) => ({
    _id,
    lastMessage:
      // eslint-disable-next-line no-nested-ternary
      messages[0]
        ? messages[0]?.type === 'text'
          ? messages[0].message
          : '(파일)'
        : undefined,
    title: ref.title,
    user: {
      ...from._id === req.auth.oid ? to : from,
      _id: undefined,
    },
  })));
}));

export default router;
