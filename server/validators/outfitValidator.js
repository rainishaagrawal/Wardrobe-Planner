const { errorResponse } = require('../utils/apiResponse');

const validateGenerateRequest = (req, res, next) => {
  const { request, occasion, mood, aesthetic, limit } = req.body;
  if (request !== undefined && typeof request !== 'string') return errorResponse(res, 'request must be a string', 400);
  if (occasion !== undefined && typeof occasion !== 'string') return errorResponse(res, 'occasion must be a string', 400);
  if (mood !== undefined && typeof mood !== 'string') return errorResponse(res, 'mood must be a string', 400);
  if (aesthetic !== undefined && typeof aesthetic !== 'string') return errorResponse(res, 'aesthetic must be a string', 400);
  if (limit !== undefined && (typeof limit !== 'number' || limit < 1 || limit > 10)) {
    return errorResponse(res, 'limit must be a number between 1 and 10', 400);
  }
  next();
};

const validateSaveOutfit = (req, res, next) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return errorResponse(res, 'items array is required', 400);
  }
  next();
};

const validateStyleItem = (req, res, next) => {
  const { wardrobeItemId } = req.body;
  if (!wardrobeItemId) return errorResponse(res, 'wardrobeItemId is required', 400);
  next();
};

module.exports = { validateGenerateRequest, validateSaveOutfit, validateStyleItem };
