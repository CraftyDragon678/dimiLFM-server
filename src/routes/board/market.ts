import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Markets, IMarketPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { beforePrice, afterPrice, ...data }: IMarketPayload = req.body;

  if (!Number.isSafeInteger(beforePrice) || beforePrice < 0) {
    return res.status(400).json({
      message: 'beforePrice must be safe integer and positive',
    });
  }

  if (!Number.isSafeInteger(afterPrice) || afterPrice < 0) {
    return res.status(400).json({
      message: 'beforePrice must be safe integer and positive',
    });
  }

  const result = await Markets.create({
    ...data,
    beforePrice,
    afterPrice,
    user: req.auth.oid,
  });
  return res.json({ _id: result._id });
}));

export default router;
