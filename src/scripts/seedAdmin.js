import 'dotenv/config';
import { connectDatabase } from '../config/db.js';
import User from '../models/User.js';

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding an administrator');
}
if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters');
await connectDatabase();
const email = process.env.ADMIN_EMAIL.toLowerCase();
let user = await User.findOne({ email });
if (user) {
  user.name = process.env.ADMIN_NAME || user.name || 'Apple Plus Admin'; user.password = process.env.ADMIN_PASSWORD; await user.save();
  console.log(`Updated administrator: ${email}`);
} else {
  await User.create({ name: process.env.ADMIN_NAME || 'Apple Plus Admin', email, password: process.env.ADMIN_PASSWORD, role: 'admin' });
  console.log(`Created administrator: ${email}`);
}
process.exit(0);
