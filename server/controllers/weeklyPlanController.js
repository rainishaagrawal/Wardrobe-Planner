const weeklyPlanService = require('../services/weekly/weeklyPlanService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const generatePlan = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.generateWeeklyPlan(req.user.userId, req.body);
    return successResponse(res, 'Weekly plan generated successfully', { plan }, 201);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const getPlan = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.getWeeklyPlan(req.user.userId, req.query.weekStart);
    return successResponse(res, 'Weekly plan fetched successfully', { plan });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const getPlanById = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.getWeeklyPlanById(req.user.userId, req.params.id);
    return successResponse(res, 'Weekly plan fetched successfully', { plan });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const updateDay = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.updateWeeklyPlanDay(req.user.userId, req.params.id, req.params.date, req.body);
    return successResponse(res, 'Weekly plan day updated successfully', { plan });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const regenerateDay = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.regenerateWeeklyPlanDay(req.user.userId, req.params.id, req.params.date);
    return successResponse(res, 'Weekly plan day regenerated successfully', { plan });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const markDayWorn = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.markDayWorn(req.user.userId, req.params.id, req.params.date);
    return successResponse(res, 'Weekly plan day marked as worn', { plan });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const skipDay = async (req, res, next) => {
  try {
    const plan = await weeklyPlanService.skipPlanDay(req.user.userId, req.params.id, req.params.date, req.body.reason);
    return successResponse(res, 'Weekly plan day skipped', { plan });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

module.exports = {
  generatePlan,
  getPlan,
  getPlanById,
  updateDay,
  regenerateDay,
  markDayWorn,
  skipDay
};
