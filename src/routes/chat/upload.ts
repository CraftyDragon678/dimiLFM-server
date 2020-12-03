import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import multer from 'multer';
import { Chats } from '../../models/chatModel';
import sendToChannel from '../../socket/send';

const router = Router();

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

router.post('/',
  upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    const { id } = req.body;
    const channel = await Chats.findById(id);
    if (!channel) return res.status(404).json({ message: 'channel not found' });
    const isFrom = channel.from === req.auth.oid;

    const message = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const type = 'image';
    await Chats.findByIdAndUpdate(id, {
      $push: {
        messages: {
          from: isFrom,
          message: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          type: 'image',
        },
      },
    });
    sendToChannel.bind(undefined)({
      me: (isFrom ? channel.from : channel.to) as number,
      other: (isFrom ? channel.to : channel.from) as number,
      channel: channel._id,
      message,
      type,
    });
    return res.status(201).json({ type: 'image' });
  }),
);

export default router;
