import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Losts, ILostPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { lostDate: [from, to], ...data }: ILostPayload = req.body;

  const result = await Losts.create({
    ...data,
    from,
    to,
    user: req.auth.oid,
  });
  return res.json({ _id: result._id });
}));

export default router;
