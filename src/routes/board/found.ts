import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Founds, IFoundPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { foundDate: [from, to], radioIndex, ...data }: IFoundPayload = req.body;
  await Founds.create({
    ...data,
    from,
    to,
    user: req.auth.oid,
  });
  res.status(204).send();
}));

export default router;
