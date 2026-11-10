import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAdmin, asyncHandler(me));
export default router;
