import { Router } from 'express';
import { createRelease, getUserReleases, pushRelease } from '../controllers/releaseController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/multerConfig.js';

const router = Router();

router.post('/', authMiddleware, uploadFields, createRelease);
router.get('/', authMiddleware, getUserReleases);
router.post('/alligatorPush', authMiddleware, pushRelease);

export default router;
