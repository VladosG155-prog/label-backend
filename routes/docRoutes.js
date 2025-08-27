import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { generateDoc } from '../services/docsService.js';
const router = Router();

router.post('/create', authMiddleware, generateDoc);

export default router;
