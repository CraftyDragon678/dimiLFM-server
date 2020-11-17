import { Router } from 'express';
import needAuth from '../../middleware/needAuth';
import chat from './chat';
import login from './login';

const router = Router();

router.use('/chat', needAuth, chat);
router.use('/login', login);

export default router;
