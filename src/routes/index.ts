import { Router } from 'express';
import needAuth from '../middleware/needAuth';
import auth from './auth';
import board from './board';
import chat from './chat';

const router = Router();

router.use('/auth', auth);
router.use('/board', needAuth, board);
router.use('/chat', needAuth, chat);

export default router;
