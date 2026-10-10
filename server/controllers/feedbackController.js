const feedbackService = require('../services/feedback/feedbackService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const submitOutfitFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.submitOutfitFeedback(req.user.userId, req.params.outfitId, req.body);
    return successResponse(res, 'Feedback submitted successfully', { feedback }, 201);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const getFeedbackHistory = async (req, res, next) => {
  try {
    const data = await feedbackService.getUserFeedback(req.user.userId, req.query);
    return successResponse(res, 'Feedback history fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.id, req.user.userId);
    return successResponse(res, 'Feedback fetched successfully', { feedback });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    await feedbackService.deleteFeedback(req.params.id, req.user.userId);
    return successResponse(res, 'Feedback deleted successfully', null);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

module.exports = {
  submitOutfitFeedback,
  getFeedbackHistory,
  getFeedback,
  deleteFeedback
};
