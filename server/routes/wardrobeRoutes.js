const express = require('express');
const {
  createItem, getItems, getItem, updateItem, deleteItem,
  updateAvailability, updateLaundryStatus, markAsWorn
} = require('../controllers/wardrobeController');
const { analyzeWardrobeItem } = require('../controllers/aiController');
const {
  validateCreateWardrobeItem, validateAvailability, validateLaundryStatus
} = require('../validators/wardrobeValidator');
const { validateAnalyzeRequest } = require('../validators/aiValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateCreateWardrobeItem, createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id/availability', validateAvailability, updateAvailability);
router.patch('/:id/laundry', validateLaundryStatus, updateLaundryStatus);
router.post('/:id/wear', markAsWorn);
router.post('/:id/analyze', validateAnalyzeRequest, analyzeWardrobeItem);

module.exports = router;
