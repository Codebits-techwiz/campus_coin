import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, 'Registered successfully', user, 201);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body.email, req.body.password);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, 'Logged in successfully', user);
  } catch (err) {
    sendError(res, 401, err.message);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { user, token } = await authService.adminLoginUser(req.body.email, req.body.password);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, 'Admin logged in successfully', user);
  } catch (err) {
    sendError(res, 401, err.message);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });
  sendSuccess(res, 'Logged out successfully');
};

export const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    // Ignore error to prevent user enumeration, always send success
    sendSuccess(res, 'If your email is registered, a password reset link has been sent to it.');
  } catch (err) {
    sendSuccess(res, 'If your email is registered, a password reset link has been sent to it.');
  }
};

export const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    sendSuccess(res, 'Password has been reset successfully.');
  } catch (err) {
    sendError(res, 400, err.message);
  }
};