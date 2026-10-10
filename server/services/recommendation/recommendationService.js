const User = require('../../models/User');
const StyleProfile = require('../../models/StyleProfile');
const WardrobeItem = require('../../models/WardrobeItem');
const { interpretRequest } = require('../ai/requestInterpreter');
const { getCurrentWeather } = require('../weather/weatherService');
const { filterWardrobe } = require('./recommendationFilters');
const { generateCandidates } = require('./outfitGenerator');
const { scoreOutfit } = require('./outfitScorer');

const getBaseContext = async (userId, params) => {
  const { request, occasion, mood, aesthetic } = params;
  let styleProfile = await StyleProfile.findOne({ user: userId });
  if (!styleProfile) {
    // create a minimal fallback so recommendations still work
    styleProfile = { 
      avoidedColors: [], 
      temporaryPreferences: [], 
      profile: { aesthetics: [] },
      styleGoals: []
    };
  }

  const context = interpretRequest(request);
  if (occasion) {
    const occ = occasion.toLowerCase();
    if (['minimal', 'streetwear', 'vintage', 'preppy', 'grunge'].includes(occ)) {
      context.aesthetic = occ;
    } else if (['comfortable', 'confident', 'relaxed'].includes(occ)) {
      context.mood = occ;
    } else {
      context.occasion = occ;
    }
  }
  if (mood) context.mood = mood;
  if (aesthetic) context.aesthetic = aesthetic;
  if (params.inspiration) context.inspiration = params.inspiration;

  const weather = await getCurrentWeather(userId);
  const wardrobeItems = await WardrobeItem.find({ user: userId });

  return { styleProfile, context, weather, wardrobeItems };
};

const processAndScore = (filteredItems, context, weather, styleProfile, anchorItem = null) => {
  let candidates = generateCandidates(filteredItems);
  
  if (anchorItem) {
    candidates = candidates.filter(candidate => 
      candidate.some(item => item._id.toString() === anchorItem._id.toString())
    );
  }

  const scoredCandidates = candidates.map(items => {
    let { score, scoreBreakdown } = scoreOutfit(items, context, weather, styleProfile); const now = new Date(); if (items.some(i => i.createdAt && (now - new Date(i.createdAt)) < (1000 * 3600 * 24 * 2))) score += 15; let avgFatigue = 0; items.forEach(i => { avgFatigue += (i.recommendationStats?.timesRecommended || 0); }); avgFatigue = avgFatigue / items.length; score = (score + Math.random() * 5) / (1 + avgFatigue * 0.5);
    return { items, score, scoreBreakdown };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);

  const uniqueOutfits = [];
  const seenKeys = new Set();
  
  for (const candidate of scoredCandidates) {
    const key = candidate.items.map(i => i._id.toString()).sort().join('_');
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueOutfits.push(candidate);
    }
  }

  return uniqueOutfits;
};

const updateTimesRecommended = async (userId, uniqueOutfits, limitNum) => {
  const topOutfits = uniqueOutfits.slice(0, limitNum);
  const itemsToUpdate = new Set();
  for (const outfit of topOutfits) {
    for (const item of outfit.items) {
      itemsToUpdate.add(item._id);
    }
  }
  if (itemsToUpdate.size > 0) {
    await WardrobeItem.updateMany(
      { _id: { $in: Array.from(itemsToUpdate) }, user: userId },
      { $inc: { 'recommendationStats.timesRecommended': 1 } }
    );
  }
  return topOutfits;
};

const generateRecommendations = async (userId, params) => {
  const { styleProfile, context, weather, wardrobeItems } = await getBaseContext(userId, params);
  const filteredItems = filterWardrobe(wardrobeItems, context, weather, styleProfile);
  const uniqueOutfits = processAndScore(filteredItems, context, weather, styleProfile);

  const limitNum = Math.min(Math.max(1, parseInt(params.limit || 30, 10)), 30);
  const topOutfits = await updateTimesRecommended(userId, uniqueOutfits, limitNum);
  
  return { weather, context, outfits: topOutfits };
};

const generateRecommendationsAroundItem = async (userId, wardrobeItemId, params) => {
  const { styleProfile, context, weather, wardrobeItems } = await getBaseContext(userId, params);
  
  const anchorItem = wardrobeItems.find(i => i._id.toString() === wardrobeItemId);
  if (!anchorItem) throw Object.assign(new Error('Wardrobe item not found'), { status: 404 });

  const filteredItems = filterWardrobe(wardrobeItems, context, weather, styleProfile);
  if (!filteredItems.find(i => i._id.toString() === wardrobeItemId)) {
    filteredItems.push(anchorItem);
  }

  const uniqueOutfits = processAndScore(filteredItems, context, weather, styleProfile, anchorItem);
  const limitNum = Math.min(Math.max(1, parseInt(params.limit || 30, 10)), 30);
  const topOutfits = await updateTimesRecommended(userId, uniqueOutfits, limitNum);
  
  return { weather, context, outfits: topOutfits };
};

const generateSurpriseRecommendations = async (userId, params) => {
  const { styleProfile, context, weather, wardrobeItems } = await getBaseContext(userId, params);
  const filteredItems = filterWardrobe(wardrobeItems, context, weather, styleProfile);
  
  let candidates = generateCandidates(filteredItems);
  const scoredCandidates = candidates.map(items => {
    let { score, scoreBreakdown } = scoreOutfit(items, context, weather, styleProfile);
    
    const now = new Date(); const newArrivalBonus = items.some(i => i.createdAt && (now - new Date(i.createdAt)) < (1000 * 3600 * 24 * 2)) ? 15 : 0; let avgFatigue = 0; items.forEach(i => { avgFatigue += (i.recommendationStats?.timesRecommended || 0); }); avgFatigue = avgFatigue / items.length; const randomBonus = Math.random() * 5;
    const underusedBonus = scoreBreakdown.wardrobeUtilization * 10;
    const noveltyBonus = scoreBreakdown.novelty * 10;
    const experimentalMultiplier = (styleProfile.experimentalLevel === 'high') ? 1.5 : 1.0;
    
    score = (score + randomBonus + underusedBonus + noveltyBonus + newArrivalBonus) * experimentalMultiplier / (1 + avgFatigue * 0.5);
    
    return { items, score, scoreBreakdown };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);

  const uniqueOutfits = [];
  const seenKeys = new Set();
  
  for (const candidate of scoredCandidates) {
    const key = candidate.items.map(i => i._id.toString()).sort().join('_');
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueOutfits.push(candidate);
    }
  }

  const limitNum = Math.min(Math.max(1, parseInt(params.limit || 30, 10)), 30);
  const topOutfits = await updateTimesRecommended(userId, uniqueOutfits, limitNum);
  
  return { weather, context, outfits: topOutfits };
};

module.exports = { generateRecommendations, generateRecommendationsAroundItem, generateSurpriseRecommendations };



