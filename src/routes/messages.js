import { Router } from 'express';
import controller from '../controllers/messages.js';

const router = Router();

router.get('/messages', controller.GET);
router.post('/messages', controller.SEND);

export default router;
