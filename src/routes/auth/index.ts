import { Router } from 'express';
import needAuth from '../../middleware/needAuth';
import chat from './socket';
import me from './me';
import revoke from './revoke';
import login from './login';

const router = Router();

router.use('/socket', needAuth, chat);
router.use('/me', needAuth, me);
router.use('/revoke', needAuth, revoke);
router.use('/login', login);

export default router;
