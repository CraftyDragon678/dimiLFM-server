import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Founds, Losts, Markets } from '../../models/boardModel';
import { Chats } from '../../models/chatModel';

const router = Router();

interface OpenPayload {
  id: string;
  board: 'found' | 'lost' | 'market';
}

router.post('/', expressAsyncHandler(async (req, res) => {
  const { id, board }: OpenPayload = req.body;
  // eslint-disable-next-line no-nested-ternary
  const article = board === 'found'
    ? await Founds.findById(id)
    : board === 'lost' // eslint-disable-line no-nested-ternary
      ? await Losts.findById(id)
      : board === 'market'
        ? await Markets.findById(id)
        : null;
  if (!article) return res.status(404).json({ message: 'Not exist' });
  if (req.auth.oid === article.user) return res.status(500).json({ message: 'writer and user id must be different' });

  if (await Chats.find({
    from: req.auth.oid,
    to: article.user,
    ref: id,
  })) return res.status(409).json({ message: 'Already exist' });
  const result = await Chats.create({
    from: req.auth.oid,
    to: article.user,
    refBoardType: board,
    ref: id,
    messages: [],
  });
  return res.status(201).json({ _id: result.id, to: result.to });
}));

export default router;
