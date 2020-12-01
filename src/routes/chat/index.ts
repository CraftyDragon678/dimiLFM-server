import { Router } from 'express';
import list from './list';
import open from './open';

const router = Router();

router.use('/list', list);
router.use('/open', open);

export default router;
