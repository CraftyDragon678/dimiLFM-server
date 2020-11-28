import { Router } from 'express';
import found from './found';
import lost from './lost';
import market from './market';

const router = Router();

router.use('/found', found);
router.use('/lost', lost);
router.use('/market', market);

export default router;
