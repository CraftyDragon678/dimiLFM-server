import { Router } from 'express';
import auth from './auth';
import board from './board';
import socket from './socket';

const router = Router();

router.use('/auth', auth);
router.use('/board', board);
router.use('/socket', socket);

export default router;
