const express = require('express');
const {
  submitOutfitFeedback,
  getFeedbackHistory,
  getFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { validateSubmitFeedback, validateId } = require('../validators/feedbackValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/outfit/:outfitId', validateId, validateSubmitFeedback, submitOutfitFeedback);
router.get('/', getFeedbackHistory);
router.get('/:id', validateId, getFeedback);
router.delete('/:id', validateId, deleteFeedback);

module.exports = router;
