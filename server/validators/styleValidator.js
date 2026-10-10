const { errorResponse } = require('../utils/apiResponse');

const validateStyleUpdate = (req, res, next) => {
  const { 
    aesthetics, formality, comfort, modesty, 
    temperaturePreference, experimentalLevel 
  } = req.body;

  const validateScore = (score) => typeof score === 'number' && score >= 0 && score <= 1;

  if (aesthetics && Array.isArray(aesthetics)) {
    for (const a of aesthetics) {
      if (!validateScore(a.score)) return errorResponse(res, 'Aesthetic scores must be between 0 and 1', 400);
    }
  }

  if (formality) {
    if (formality.casual !== undefined && !validateScore(formality.casual)) return errorResponse(res, 'Formality scores must be between 0 and 1', 400);
    if (formality.smartCasual !== undefined && !validateScore(formality.smartCasual)) return errorResponse(res, 'Formality scores must be between 0 and 1', 400);
    if (formality.formal !== undefined && !validateScore(formality.formal)) return errorResponse(res, 'Formality scores must be between 0 and 1', 400);
  }

  if (comfort !== undefined && !validateScore(comfort)) return errorResponse(res, 'Comfort must be between 0 and 1', 400);
  if (modesty !== undefined && !validateScore(modesty)) return errorResponse(res, 'Modesty must be between 0 and 1', 400);
  if (experimentalLevel !== undefined && !validateScore(experimentalLevel)) return errorResponse(res, 'ExperimentalLevel must be between 0 and 1', 400);

  if (temperaturePreference !== undefined) {
    const validTemps = ['cold', 'cool', 'neutral', 'warm', 'hot'];
    if (!validTemps.includes(temperaturePreference)) {
      return errorResponse(res, 'Invalid temperaturePreference', 400);
    }
  }

  next();
};

const validateTempPreference = (req, res, next) => {
  const { type, value, expiresAt } = req.body;
  if (!type || typeof type !== 'string') return errorResponse(res, 'Type is required and must be a string', 400);
  if (!value || typeof value !== 'string') return errorResponse(res, 'Value is required and must be a string', 400);
  if (!expiresAt || isNaN(Date.parse(expiresAt))) return errorResponse(res, 'A valid expiresAt date is required', 400);
  next();
};

module.exports = { validateStyleUpdate, validateTempPreference };
