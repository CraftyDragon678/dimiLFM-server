import { Router } from 'express';
import found from './found';
import lost from './lost';

const router = Router();

router.use('/found', found);
router.use('/found', lost);

export default router;
