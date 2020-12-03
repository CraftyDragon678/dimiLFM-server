import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Users from '../../models/userModel';

const router = Router();

router.get('/', expressAsyncHandler(async (req, res) => {
  const result = await Users.findById(req.auth.oid).select('-_id name serial type profileimage');
  if (!result) return res.status(404).json({ message: 'Not found' });

  return res.json(result);
}));

export default router;
