const { errorResponse } = require('../utils/apiResponse');
const mongoose = require('mongoose');

const validateId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 'Invalid ID format', 400);
  }
  if (req.body.inspirationId && !mongoose.Types.ObjectId.isValid(req.body.inspirationId)) {
    return errorResponse(res, 'Invalid Inspiration ID format', 400);
  }
  next();
};

const validateInspiration = (req, res, next) => {
  const { imageUrl, sourceUrl, tags } = req.body;
  if (!imageUrl && !sourceUrl) {
    return errorResponse(res, 'imageUrl or sourceUrl is required', 400);
  }
  if (tags && !Array.isArray(tags)) {
    return errorResponse(res, 'tags must be an array', 400);
  }
  next();
};

module.exports = { validateId, validateInspiration };
