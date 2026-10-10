const recommendationService = require('../services/recommendation/recommendationService');
const outfitService = require('../services/outfit/outfitService');
const Outfit = require('../models/Outfit');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const generateOutfits = async (req, res, next) => {
  try {
    const data = await recommendationService.generateRecommendations(req.user.userId, req.body);
    return successResponse(res, 'Outfits generated successfully', data);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const styleItem = async (req, res, next) => {
  try {
    const { wardrobeItemId, ...params } = req.body;
    const data = await recommendationService.generateRecommendationsAroundItem(req.user.userId, wardrobeItemId, params);
    return successResponse(res, 'Outfits generated successfully', data);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const generateSurprise = async (req, res, next) => {
  try {
    const data = await recommendationService.generateSurpriseRecommendations(req.user.userId, req.body);
    return successResponse(res, 'Surprise outfits generated successfully', data);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const generateFromInspiration = async (req, res, next) => {
  try {
    const { inspirationId, ...params } = req.body;
    const inspirationService = require('../services/inspiration/inspirationService');
    const inspiration = await inspirationService.getInspirationById(req.user.userId, inspirationId);
    
    params.inspiration = inspiration;
    const data = await recommendationService.generateRecommendations(req.user.userId, params);
    return successResponse(res, 'Outfits from inspiration generated successfully', data);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const getTodaysOutfits = async (req, res, next) => {
  try {
    const data = await outfitService.getTodaysOutfits(req.user.userId, req.query);
    return successResponse(res, "Today's outfit recommendations generated successfully", data);
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const getOutfitHistory = async (req, res, next) => {
  try {
    const data = await outfitService.getOutfitHistory(req.user.userId, req.query);
    return successResponse(res, 'Outfit history fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

const getOutfit = async (req, res, next) => {
  try {
    const outfit = await outfitService.getOutfitById(req.params.id, req.user.userId);
    if (!outfit) return errorResponse(res, 'Outfit not found', 404);
    return successResponse(res, 'Outfit fetched successfully', { outfit });
  } catch (error) {
    next(error);
  }
};

const saveOutfit = async (req, res, next) => {
  try {
    const outfit = await outfitService.saveOutfit(req.params.id, req.user.userId);
    return successResponse(res, 'Outfit saved successfully', { outfit });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const markOutfitWorn = async (req, res, next) => {
  try {
    const outfit = await outfitService.markOutfitAsWorn(req.params.id, req.user.userId);
    return successResponse(res, 'Outfit marked as worn successfully', { outfit });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const createAndSaveOutfit = async (req, res, next) => {
  try {
    const { items, occasion, mood, aesthetic, weatherSnapshot, score, scoreBreakdown } = req.body;
    const outfit = await Outfit.create({
      user: req.user.userId,
      items,
      occasion,
      mood,
      aesthetic,
      weatherSnapshot,
      score,
      scoreBreakdown,
      saved: true,
      status: 'saved'
    });
    return successResponse(res, 'Outfit saved successfully', { outfit }, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

