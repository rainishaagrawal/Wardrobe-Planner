const { errorResponse } = require('../utils/apiResponse');
const mongoose = require('mongoose');

const validateId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 'Invalid ID format', 400);
  }
  next();
};

const validateDateString = (req, res, next) => {
  const dateStr = req.params.date || req.body.weekStart || req.query.weekStart;
  if (dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (req.params.date && !regex.test(req.params.date)) {
      return errorResponse(res, 'Date must be in YYYY-MM-DD format', 400);
    }
  }
  next();
};

module.exports = { validateId, validateDateString };
