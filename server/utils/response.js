export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};
export const sendError = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({ success: false, error: message, errors });
};