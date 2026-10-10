const express = require('express');
const { 
  generateOutfits, 
  styleItem,
  generateSurprise,
  generateFromInspiration,
  getTodaysOutfits, 
  getOutfitHistory, 
  getOutfit, 
  saveOutfit, 
  createAndSaveOutfit,
  markOutfitWorn 
} = require('../controllers/outfitController');
const { validateGenerateRequest, validateSaveOutfit, validateStyleItem } = require('../validators/outfitValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', validateGenerateRequest, generateOutfits);
router.get('/today', getTodaysOutfits);
router.get('/history', getOutfitHistory);
router.get('/:id', getOutfit);

router.post('/style-item', validateStyleItem, styleItem);
router.post('/surprise', generateSurprise);
router.post('/from-inspiration', generateFromInspiration);

router.post('/save', validateSaveOutfit, createAndSaveOutfit);
router.post('/:id/save', saveOutfit);
router.post('/:id/worn', markOutfitWorn);

module.exports = router;
