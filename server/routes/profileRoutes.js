const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { validateProfileUpdate } = require('../validators/profileValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', validateProfileUpdate, updateProfile);

module.exports = router;
