import { Router } from 'express';
import needAuth from '../../middleware/needAuth';
import chat from './socket';
import login from './login';

const router = Router();

router.use('/socket', needAuth, chat);
router.use('/login', login);

export default router;
