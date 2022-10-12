import { Router } from 'express';
import controller from '../controllers/files.js';

const router = Router();

router.get('/view/:fileName', controller.GET);
router.get('/download/:fileName', controller.DOWNLOAD);

export default router;
