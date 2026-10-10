const { errorResponse } = require('../utils/apiResponse');

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim() === '') return errorResponse(res, 'Name is required', 400);
  if (!email || email.trim() === '') return errorResponse(res, 'Email is required', 400);
  if (!password || password.length < 6) return errorResponse(res, 'Password must be at least 6 characters', 400);
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === '') return errorResponse(res, 'Email is required', 400);
  if (!password) return errorResponse(res, 'Password is required', 400);
  next();
};

module.exports = { validateRegister, validateLogin };
