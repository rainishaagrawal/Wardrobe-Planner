const styleProfileService = require('../services/styleProfileService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getStyleProfile = async (req, res, next) => {
  try {
    const profile = await styleProfileService.getOrCreateStyleProfile(req.user.userId);
    return successResponse(res, 'Style profile fetched successfully', { profile });
  } catch (error) {
    next(error);
  }
};

const updateStyleProfile = async (req, res, next) => {
  try {
    const profile = await styleProfileService.updateStyleProfile(req.user.userId, req.body);
    return successResponse(res, 'Style profile updated successfully', { profile });
  } catch (error) {
    next(error);
  }
};

const addTemporaryPreference = async (req, res, next) => {
  try {
    const profile = await styleProfileService.addTemporaryPreference(req.user.userId, req.body);
    return successResponse(res, 'Temporary preference added successfully', { profile }, 201);
  } catch (error) {
    next(error);
  }
};

const removeTemporaryPreference = async (req, res, next) => {
  try {
    const profile = await styleProfileService.removeTemporaryPreference(req.user.userId, req.params.id);
    return successResponse(res, 'Temporary preference removed successfully', { profile });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

module.exports = { getStyleProfile, updateStyleProfile, addTemporaryPreference, removeTemporaryPreference };
