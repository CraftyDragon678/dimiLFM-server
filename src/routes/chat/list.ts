import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Chats } from '../../models/chatModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const result = await Chats.aggregate([
    {
      $match: {
        $or: [
          { from: req.auth.oid },
          { to: req.auth.oid },
        ],
      },
    },
    {
      $project: {
        messages: { $slice: ['$messages', -1] },
        from: 1,
        to: 1,
      },
    },
  ]);
  return res.json(result.map((e) => ({ ...e, messages: e.messages[0] })));
}));

export default router;
