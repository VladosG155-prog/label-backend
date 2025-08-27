import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { approveArtist, createUserArtist, getArtists } from '../controllers/artistsController.js';

const router = Router();

router.get('/', authMiddleware, getArtists);
router.post('/approve', authMiddleware, approveArtist);
router.post('/create', authMiddleware, createUserArtist);

export default router;
