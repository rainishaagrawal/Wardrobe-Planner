const express = require('express');
const { getStyleProfile, updateStyleProfile, addTemporaryPreference, removeTemporaryPreference } = require('../controllers/styleController');
const { validateStyleUpdate, validateTempPreference } = require('../validators/styleValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getStyleProfile);
router.put('/profile', validateStyleUpdate, updateStyleProfile);
router.post('/temporary-preference', validateTempPreference, addTemporaryPreference);
router.delete('/temporary-preference/:id', removeTemporaryPreference);

module.exports = router;
