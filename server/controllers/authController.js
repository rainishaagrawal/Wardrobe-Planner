const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.registerUser({ name, email, password });
    return successResponse(res, 'Registration successful', { user, token }, 201);
  } catch (error) {
    if (error.status === 409) return errorResponse(res, error.message, 409);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });
    return successResponse(res, 'Login successful', { user, token }, 200);
  } catch (error) {
    if (error.status === 401) return errorResponse(res, error.message, 401);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    return successResponse(res, 'Current user', { user }, 200);
  } catch (error) {
    if (error.status === 404) return errorResponse(res, error.message, 404);
    next(error);
  }
};

module.exports = { register, login, getMe };
