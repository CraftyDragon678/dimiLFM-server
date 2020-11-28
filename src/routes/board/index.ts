import { Router } from 'express';
import needAuth from '../../middleware/needAuth';
import found from './found';

const router = Router();

router.use('/found', needAuth, found);

export default router;
