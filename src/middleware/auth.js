import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new AppError('Authentication required', 401);
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { throw new AppError('Your session is invalid or expired', 401); }
  const user = await User.findById(payload.sub);
  if (!user || user.role !== 'admin') throw new AppError('Administrator access required', 403);
  req.user = user;
  next();
});
