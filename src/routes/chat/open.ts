import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Books, Founds, Losts, Markets } from '../../models/boardModel';
import { Chats } from '../../models/chatModel';

const router = Router();

interface OpenPayload {
  id: string;
  board: 'found' | 'lost' | 'market' | 'book';
}

router.post('/', expressAsyncHandler(async (req, res) => {
  const { id, board }: OpenPayload = req.body;
  // eslint-disable-next-line no-nested-ternary
  const article = board === 'found'
    ? await Founds.findById(id)
    : board === 'lost' // eslint-disable-line no-nested-ternary
      ? await Losts.findById(id)
      : board === 'market' // eslint-disable-line no-nested-ternary
        ? await Markets.findById(id)
        : board === 'book'
          ? await Books.findById(id)
          : null;
  if (!article) return res.status(404).json({ message: 'Not exist' });
  if (req.auth.oid === article.user) return res.status(400).json({ message: 'writer and user id must be different' });

  const existData = await Chats.findOne({
    from: req.auth.oid,
    to: article.user,
    ref: id,
  });
  if (existData) {
    return res.status(409).json({
      _id: existData._id,
      message: 'Already exist',
    });
  }
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
