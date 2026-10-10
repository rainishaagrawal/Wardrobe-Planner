const Outfit = require('../../models/Outfit');
const WardrobeItem = require('../../models/WardrobeItem');
const recommendationService = require('../recommendation/recommendationService');

const getOutfitById = async (outfitId, userId) => {
  return await Outfit.findOne({ _id: outfitId, user: userId }).populate('items', 'name category subcategory primaryColor secondaryColors imageUrl thumbnailUrl brand fit pattern material');
};

const saveOutfit = async (outfitId, userId) => {
  const outfit = await Outfit.findOneAndUpdate(
    { _id: outfitId, user: userId },
    { saved: true, status: 'saved' },
    { new: true }
  ).populate('items', 'name category subcategory primaryColor secondaryColors imageUrl thumbnailUrl brand fit pattern material');
  
  if (!outfit) {
    throw Object.assign(new Error('Outfit not found'), { status: 404 });
  }
  return outfit;
};

const markOutfitAsWorn = async (outfitId, userId) => {
  const outfit = await Outfit.findOne({ _id: outfitId, user: userId });
  if (!outfit) {
    throw Object.assign(new Error('Outfit not found'), { status: 404 });
  }

  if (outfit.status === 'worn') {
    return await outfit.populate('items', 'name category subcategory primaryColor secondaryColors imageUrl thumbnailUrl brand fit pattern material');
  }

  // Update WardrobeItems
  const now = new Date();
  await WardrobeItem.updateMany(
    { _id: { $in: outfit.items }, user: userId },
    { 
      $inc: { wearCount: 1, 'recommendationStats.timesSelected': 1 },
      $set: { lastWornAt: now }
    }
  );

  outfit.status = 'worn';
  outfit.wornAt = now;
  outfit.saved = true;
  await outfit.save();

  return await outfit.populate('items', 'name category subcategory primaryColor secondaryColors imageUrl thumbnailUrl brand fit pattern material');
};

const getOutfitHistory = async (userId, filters) => {
  const { page = 1, limit = 20, status, occasion, from, to } = filters;
  const parsedLimit = Math.min(Math.max(1, parseInt(limit)), 50);
  const skip = (parseInt(page) - 1) * parsedLimit;

  const query = { user: userId };
  if (status) query.status = status;
  if (occasion) query.occasion = occasion;
  if (from || to) {
    query.generatedAt = {};
    if (from) query.generatedAt.$gte = new Date(from);
    if (to) query.generatedAt.$lte = new Date(to);
  }

  const outfits = await Outfit.find(query)
    .sort({ generatedAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .populate('items', 'name category subcategory primaryColor secondaryColors imageUrl thumbnailUrl brand fit pattern material');

  const total = await Outfit.countDocuments(query);

  return {
    outfits,
    pagination: {
      page: parseInt(page),
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit)
    }
  };
};

const getTodaysOutfits = async (userId, params = {}) => {
  const result = await recommendationService.generateRecommendations(userId, { limit: 25, ...params });
  
  // Attach the active filter as a tag so the frontend can display it in the correct tab
  const tag = params.occasion || 'Casual';
  const taggedOutfits = result.outfits.map(o => ({
    ...o,
    tags: [tag.charAt(0).toUpperCase() + tag.slice(1)]
  }));

  return {
    weather: result.weather,
    outfits: taggedOutfits,
    generatedAt: new Date()
  };
};

module.exports = {
  getOutfitById,
  saveOutfit,
  markOutfitAsWorn,
  getOutfitHistory,
  getTodaysOutfits
};
