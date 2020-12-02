import { Router } from 'express';
import fetch from './fetch';
import list from './list';
import open from './open';

const router = Router();

router.use('/fetch', fetch);
router.use('/list', list);
router.use('/open', open);

export default router;
