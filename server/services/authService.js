import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail } from './emailService.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

export const registerUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error('User already exists');
  const passwordHash = await hashPassword(data.password);
  const user = await User.create({ ...data, passwordHash });
  const token = generateToken(user._id);
  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await comparePassword(password, user.passwordHash))) throw new Error('Invalid credentials');
  if (user.role === 'admin') throw new Error('Invalid credentials'); // Reject admin accounts
  user.passwordHash = undefined;
  const token = generateToken(user._id);
  return { user, token };
};

export const adminLoginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await comparePassword(password, user.passwordHash))) throw new Error('Invalid credentials');
  if (user.role !== 'admin') throw new Error('Invalid credentials'); // Reject student accounts
  user.passwordHash = undefined;
  const token = generateToken(user._id);
  return { user, token };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return; // Do not throw error to avoid user enumeration
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes expiry
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  await sendResetPasswordEmail(user.email, user.name, resetUrl);
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetTokenHash: hashedToken,
    resetTokenExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new Error('Invalid or expired password reset token');
  }
  
  user.passwordHash = await hashPassword(newPassword);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
};