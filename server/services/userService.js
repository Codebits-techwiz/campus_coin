import { User } from '../models/User.js';
import { formatUserResponse } from './authService.js';
import { toCents } from '../utils/money.js';

/**
 * User Service
 * Business logic layer for retrieving and updating student user profile.
 */

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User profile not found');
    error.statusCode = 404;
    throw error;
  }
  return formatUserResponse(user);
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User profile not found');
    error.statusCode = 404;
    throw error;
  }

  // Update allowed fields
  if (updateData.name !== undefined) user.name = updateData.name;
  if (updateData.academicYear !== undefined) user.academicYear = updateData.academicYear;
  if (updateData.currency !== undefined) user.currency = updateData.currency;

  // Convert amounts to cents integer before saving
  if (updateData.monthlyAllowanceBaseline !== undefined) {
    user.monthlyAllowanceBaseline = toCents(updateData.monthlyAllowanceBaseline);
  }
  if (updateData.monthlySavingsGoal !== undefined) {
    user.monthlySavingsGoal = toCents(updateData.monthlySavingsGoal);
  }

  await user.save();
  return formatUserResponse(user);
};
