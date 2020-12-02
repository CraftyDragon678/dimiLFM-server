import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Chats, IChatPopulated } from '../../models/chatModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const { id } = req.query;
  const result: IChatPopulated | null = await Chats.findById(id)
    .populate('from', 'serial type name profileimage')
    .populate('to', 'serial type name profileimage')
    .populate('ref', '-user -done -createdAt -updatedAt -tag')
    .select('-messages._id -messages.updatedAt')
    .lean();

  if (!result || (req.auth.oid !== result.from._id && req.auth.oid !== result.to._id)) {
    return res.status(404).json({ message: 'Not Found' });
  }

  return res.json({
    messages: result.messages.map((e) => ({
      mine: (result.from._id === req.auth.oid && e.from)
        || (result.to._id === req.auth.oid && !e.from),
      message: e.message,
      type: e.type,
      sendAt: e.createdAt,
    })),
    ref: {
      ...result.ref,
      content: result.ref.content.replace(/<[^>]*>/g, '').slice(0, 100),
    },
  });
}));

export default router;
