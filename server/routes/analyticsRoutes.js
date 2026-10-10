const express = require('express');
const {
  getOverview, getWardrobeAnalytics, getOutfitAnalytics, getStyleAnalytics
} = require('../controllers/analyticsController');
const { validateDateFilter } = require('../validators/analyticsValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', validateDateFilter, getOverview);
router.get('/wardrobe', validateDateFilter, getWardrobeAnalytics);
router.get('/outfits', validateDateFilter, getOutfitAnalytics);
router.get('/style', validateDateFilter, getStyleAnalytics);

module.exports = router;
