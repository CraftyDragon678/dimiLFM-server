import { Router } from 'express';
import needAuth from '../middleware/needAuth';
import auth from './auth';
import board from './board';
import socket from './socket';

const router = Router();

router.use('/auth', auth);
router.use('/board', needAuth, board);
router.use('/socket', socket);

export default router;
