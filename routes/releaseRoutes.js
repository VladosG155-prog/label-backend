import { Router } from 'express';
import { createRelease, getUserReleases } from '../controllers/releaseController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/multerConfig.js';

const router = Router();

router.post('/', authMiddleware, uploadFields, createRelease);
router.get('/', authMiddleware, getUserReleases);

export default router;
