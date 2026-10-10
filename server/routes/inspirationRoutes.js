const express = require('express');
const {
  createInspiration, getInspirations, getInspirationById, updateInspiration, deleteInspiration, analyzeInspiration
} = require('../controllers/inspirationController');
const { validateId, validateInspiration } = require('../validators/inspirationValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateInspiration, createInspiration);
router.get('/', getInspirations);
router.get('/:id', validateId, getInspirationById);
router.put('/:id', validateId, validateInspiration, updateInspiration);
router.delete('/:id', validateId, deleteInspiration);
router.post('/:id/analyze', validateId, analyzeInspiration);

module.exports = router;
