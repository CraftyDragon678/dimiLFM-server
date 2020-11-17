import { Router } from 'express';
import auth from './auth';
import socket from './socket';

const router = Router();

router.use('/auth', auth);
router.use('/socket', socket);

export default router;
