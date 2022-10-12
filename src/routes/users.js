import { Router } from 'express';
import controller from '../controllers/users.js';
import validation from '../middlewares/validation.js';

const router = Router();

router.post('/login', validation, controller.LOGIN);
router.post('/register', validation, controller.REGISTER);
router.get('/users', controller.GET);

export default router;
