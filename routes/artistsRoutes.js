import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getArtists } from '../controllers/artistsController.js';

const router = Router();

router.get('/', authMiddleware, getArtists);

export default router;
