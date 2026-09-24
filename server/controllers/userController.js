import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    sendSuccess(res, 'Profile retrieved', user);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    sendSuccess(res, 'Profile updated', user);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};