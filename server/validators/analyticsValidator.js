const { errorResponse } = require('../utils/apiResponse');

const validateDateFilter = (req, res, next) => {
  const { from, to } = req.query;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (from) {
    if (!regex.test(from) && isNaN(Date.parse(from))) {
      return errorResponse(res, 'Invalid from date format', 400);
    }
  }
  if (to) {
    if (!regex.test(to) && isNaN(Date.parse(to))) {
      return errorResponse(res, 'Invalid to date format', 400);
    }
  }
  if (from && to) {
    if (new Date(from) > new Date(to)) {
      return errorResponse(res, 'From date cannot be after to date', 400);
    }
  }
  next();
};

module.exports = { validateDateFilter };
