import { Router } from 'express';
import {
  requestTelegramLogin,
  receiveTelegramData,
  pollLoginStatus,
  authMe
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/telegram/request', requestTelegramLogin);
router.post('/telegram/data', receiveTelegramData);
router.get('/poll', pollLoginStatus);
router.get('/me', authMiddleware, authMe);

export default router;
