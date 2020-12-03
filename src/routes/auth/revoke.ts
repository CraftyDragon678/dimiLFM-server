import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.post('/', expressAsyncHandler(async (req, res) => res.clearCookie('token').json({ message: 'ok' })));

export default router;
