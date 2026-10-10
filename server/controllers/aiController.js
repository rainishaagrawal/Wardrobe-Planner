const aiService = require('../services/ai/aiService');
const WardrobeItem = require('../models/WardrobeItem');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const analyzeWardrobeItem = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const itemId = req.params.id;

    // 1. Verify ownership and existence
    const item = await WardrobeItem.findOne({ _id: itemId, user: userId });
    if (!item) {
      return errorResponse(res, 'Wardrobe item not found', 404);
    }

    // 2. Call AI Service
    const itemData = {
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      primaryColor: item.primaryColor,
      pattern: item.pattern,
      material: item.material,
      fit: item.fit,
      imageUrl: item.imageUrl // Pass image URL for Gemini Vision
    };
    
    const analysis = await aiService.analyzeClothing(itemData);

    // 3. Merge: Explicit user data wins over AI
    const fieldsToMerge = [
      'category', 'subcategory', 'primaryColor', 'secondaryColors', 'pattern', 
      'material', 'fit', 'formality', 'season', 'weatherSuitability', 'aesthetics', 'genderNeutral'
    ];

    fieldsToMerge.forEach(field => {
      const isEmpty = (val) => {
        if (val === null || val === undefined) return true;
        if (Array.isArray(val) && val.length === 0) return true;
        return false;
      };

      // Only fill missing metadata. Do not overwrite if user provided it.
      if (isEmpty(item[field])) {
        item[field] = analysis[field];
      }
    });

    // 4. Set AI analysis metadata
    item.aiAnalysis = {
      analyzed: true,
      confidence: analysis.confidence || 0.85,
      analyzedAt: new Date()
    };

    await item.save();

    return successResponse(res, 'Wardrobe item analyzed successfully', { item });
  } catch (error) {
    return errorResponse(res, 'Unable to analyze wardrobe item', 500);
  }
};

module.exports = { analyzeWardrobeItem };
