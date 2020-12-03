import { Router } from 'express';
import fetch from './fetch';
import list from './list';
import open from './open';
import upload from './upload';

const router = Router();

router.use('/fetch', fetch);
router.use('/list', list);
router.use('/open', open);
router.use('/upload', upload);

export default router;
