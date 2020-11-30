import { Router } from 'express';
import needAuth from '../middleware/needAuth';
import auth from './auth';
import board from './board';

const router = Router();

router.use('/auth', auth);
router.use('/board', needAuth, board);

export default router;
