import * as userService from '../services/userService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    sendSuccess(res, 'Profile retrieved', user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    sendSuccess(res, 'Profile updated', user);
  } catch (err) {
    next(err);
  }
};