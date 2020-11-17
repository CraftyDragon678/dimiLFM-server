import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  console.log(req.auth);
  res.send();
}));

export default router;
