import { Router } from 'express';
import found from './found';
import lost from './lost';
import market from './market';
import search from './search';

const router = Router();

router.use('/found', found);
router.use('/lost', lost);
router.use('/market', market);
router.use('/search', search);

export default router;
