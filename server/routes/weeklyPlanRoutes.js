const express = require('express');
const {
  generatePlan,
  getPlan,
  getPlanById,
  updateDay,
  regenerateDay,
  markDayWorn,
  skipDay
} = require('../controllers/weeklyPlanController');
const { validateId, validateDateString } = require('../validators/weeklyPlanValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', validateDateString, generatePlan);
router.get('/', validateDateString, getPlan);
router.get('/:id', validateId, getPlanById);
router.put('/:id/day/:date', validateId, validateDateString, updateDay);
router.post('/:id/day/:date/regenerate', validateId, validateDateString, regenerateDay);
router.post('/:id/day/:date/worn', validateId, validateDateString, markDayWorn);
router.post('/:id/day/:date/skip', validateId, validateDateString, skipDay);

module.exports = router;
