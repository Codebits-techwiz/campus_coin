import TransactionTemplate from '../models/TransactionTemplate.js';

/**
 * TransactionTemplate Service (formerly bookmarkService)
 * Manages quick-entry transaction templates for students.
 */

export const getTemplates = async (userId) => {
  return TransactionTemplate.find({ user: userId })
    .populate('category', 'name icon color')
    .sort({ createdAt: -1 });
};

export const createTemplate = async (userId, data) => {
  const template = new TransactionTemplate({ user: userId, ...data });
  await template.save();
  return template;
};

export const updateTemplate = async (userId, templateId, data) => {
  const template = await TransactionTemplate.findOneAndUpdate(
    { _id: templateId, user: userId },
    data,
    { new: true, runValidators: true }
  );
  if (!template) {
    const err = new Error('Transaction template not found');
    err.statusCode = 404;
    throw err;
  }
  return template;
};

export const deleteTemplate = async (userId, templateId) => {
  const template = await TransactionTemplate.findOneAndDelete({ _id: templateId, user: userId });
  if (!template) {
    const err = new Error('Transaction template not found');
    err.statusCode = 404;
    throw err;
  }
};
