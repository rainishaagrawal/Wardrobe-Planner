const wardrobeAnalyticsService = require('../services/analytics/wardrobeAnalyticsService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getOverview = async (req, res, next) => {
  try {
    const data = await wardrobeAnalyticsService.getAnalyticsOverview(req.user.userId, req.query);
    return successResponse(res, 'Analytics overview fetched successfully', data);
  } catch (error) { next(error); }
};

const getWardrobeAnalytics = async (req, res, next) => {
  try {
    const data = await wardrobeAnalyticsService.getWardrobeAnalytics(req.user.userId, req.query);
    return successResponse(res, 'Wardrobe analytics fetched successfully', data);
  } catch (error) { next(error); }
};

const getOutfitAnalytics = async (req, res, next) => {
  try {
    const data = await wardrobeAnalyticsService.getOutfitAnalytics(req.user.userId, req.query);
    return successResponse(res, 'Outfit analytics fetched successfully', data);
  } catch (error) { next(error); }
};

const getStyleAnalytics = async (req, res, next) => {
  try {
    const data = await wardrobeAnalyticsService.getStyleAnalytics(req.user.userId, req.query);
    return successResponse(res, 'Style analytics fetched successfully', data);
  } catch (error) { next(error); }
};

module.exports = {
  getOverview, getWardrobeAnalytics, getOutfitAnalytics, getStyleAnalytics
};
