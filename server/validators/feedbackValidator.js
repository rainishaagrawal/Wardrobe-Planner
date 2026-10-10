const { errorResponse } = require('../utils/apiResponse');
const mongoose = require('mongoose');

const validateSubmitFeedback = (req, res, next) => {
  const { rating, comment } = req.body;
  if (!['like', 'dislike', 'skip'].includes(rating)) {
    return errorResponse(res, 'Invalid rating. Must be like, dislike, or skip', 400);
  }
  if (comment && comment.length > 500) {
    return errorResponse(res, 'Comment must be less than 500 characters', 400);
  }
  next();
};

const validateId = (req, res, next) => {
  const id = req.params.id || req.params.outfitId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 'Invalid ID format', 400);
  }
  next();
};

module.exports = { validateSubmitFeedback, validateId };
