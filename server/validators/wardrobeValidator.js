const { errorResponse } = require('../utils/apiResponse');

const validCategories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory'];
const validAvailability = ['available', 'unavailable', 'archived'];
const validLaundryStatus = ['clean', 'dirty', 'washing'];
const validFormality = ['casual', 'smartCasual', 'formal'];

const validateCreateWardrobeItem = (req, res, next) => {
  const { name, category, primaryColor, formality, weatherSuitability } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return errorResponse(res, 'Name is required and must be a string', 400);
  }
  if (!category || !validCategories.includes(category)) {
    return errorResponse(res, `Category must be one of: ${validCategories.join(', ')}`, 400);
  }
  if (!primaryColor || typeof primaryColor !== 'string' || primaryColor.trim() === '') {
    return errorResponse(res, 'PrimaryColor is required and must be a string', 400);
  }
  if (formality && !validFormality.includes(formality)) {
    return errorResponse(res, `Formality must be one of: ${validFormality.join(', ')}`, 400);
  }

  if (weatherSuitability) {
    if (weatherSuitability.minTemperature !== undefined && typeof weatherSuitability.minTemperature !== 'number') {
      return errorResponse(res, 'minTemperature must be a number', 400);
    }
    if (weatherSuitability.maxTemperature !== undefined && typeof weatherSuitability.maxTemperature !== 'number') {
      return errorResponse(res, 'maxTemperature must be a number', 400);
    }
  }

  next();
};

const validateAvailability = (req, res, next) => {
  const { availability } = req.body;
  if (!availability || !validAvailability.includes(availability)) {
    return errorResponse(res, `Availability must be one of: ${validAvailability.join(', ')}`, 400);
  }
  next();
};

const validateLaundryStatus = (req, res, next) => {
  const { laundryStatus } = req.body;
  if (!laundryStatus || !validLaundryStatus.includes(laundryStatus)) {
    return errorResponse(res, `LaundryStatus must be one of: ${validLaundryStatus.join(', ')}`, 400);
  }
  next();
};

module.exports = { validateCreateWardrobeItem, validateAvailability, validateLaundryStatus };
