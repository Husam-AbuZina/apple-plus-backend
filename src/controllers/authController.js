import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });
const safeUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchesPassword(password))) throw new AppError('Invalid email or password', 401);
  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.cookie('token', token, cookieOptions()).json({ user: safeUser(user) });
});

export function logout(req, res) {
  res.clearCookie('token', { ...cookieOptions(), maxAge: 0 }).status(204).send();
}

export function me(req, res) { res.json({ user: safeUser(req.user) }); }
