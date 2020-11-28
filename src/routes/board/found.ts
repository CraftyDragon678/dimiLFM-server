import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Founds } from '../../models/boardModel';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => {
  const data = req.body;
  Founds.create(data);
  res.status(204).send();
}));

export default router;
