import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { updateUserRole } from '../controllers/adminController.js';

const router = Router();

router.post('/user', authMiddleware, updateUserRole);

export default router;
