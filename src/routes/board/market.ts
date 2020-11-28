import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Markets, IMarketPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { beforePrice, afterPrice, ...data }: IMarketPayload = req.body;

  const result = await Markets.create({
    ...data,
    beforePrice: beforePrice.toString(),
    afterPrice: afterPrice.toString(),
    user: req.auth.oid,
  });
  return res.json({ _id: result._id });
}));

export default router;
