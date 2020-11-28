import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Founds, IFoundPayload } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const { foundDate: [from, to], radioIndex, ...data }: IFoundPayload = req.body;
  if (!(radioIndex >= 0 && radioIndex <= 2)) {
    return res.status(400).json({
      message: 'radioIndex must be greater than or 0 to zero and less than or equal to 2',
    });
  }

  const result = await Founds.create({
    ...data,
    from,
    to,
    radioIndex,
    user: req.auth.oid,
  });
  res.json({ _id: result._id });
}));

export default router;
