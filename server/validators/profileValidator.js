const { errorResponse } = require('../utils/apiResponse');

const validateProfileUpdate = (req, res, next) => {
  const { name, location, timezone, profileImage, onboardingCompleted } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return errorResponse(res, 'Name must be a non-empty string', 400);
  }
  if (location !== undefined && typeof location !== 'string') {
    return errorResponse(res, 'Location must be a string', 400);
  }
  if (timezone !== undefined && typeof timezone !== 'string') {
    return errorResponse(res, 'Timezone must be a string', 400);
  }
  if (profileImage !== undefined && typeof profileImage !== 'string') {
    return errorResponse(res, 'ProfileImage must be a string', 400);
  }
  if (onboardingCompleted !== undefined && typeof onboardingCompleted !== 'boolean') {
    return errorResponse(res, 'OnboardingCompleted must be a boolean', 400);
  }
  next();
};

module.exports = { validateProfileUpdate };
