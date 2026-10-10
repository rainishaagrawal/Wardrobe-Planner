const profileService = require('../services/profileService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const user = await profileService.getProfile(req.user.userId);
    return successResponse(res, 'Profile fetched successfully', { user });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await profileService.updateProfile(req.user.userId, req.body);
    return successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
