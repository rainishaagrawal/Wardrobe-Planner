const WardrobeItem = require('../../models/WardrobeItem');
const Outfit = require('../../models/Outfit');
const Feedback = require('../../models/Feedback');
const WeeklyPlan = require('../../models/WeeklyPlan');
const Inspiration = require('../../models/Inspiration');
const StyleProfile = require('../../models/StyleProfile');

const generateInsights = (wardrobeStats, outfitStats) => {
  const insights = [];
  if (wardrobeStats.totalItems > 0) {
    insights.push(`Your wardrobe utilization is ${wardrobeStats.utilizationRate}%.`);
    if (wardrobeStats.neverWorn > 0) {
      insights.push(`${wardrobeStats.neverWorn} wardrobe items have never been worn.`);
    }
    if (wardrobeStats.colorDistribution.length > 0) {
      const topColor = wardrobeStats.colorDistribution[0].color;
      insights.push(`${topColor.charAt(0).toUpperCase() + topColor.slice(1)} is your most frequently owned color.`);
    }
    if (wardrobeStats.categoryDistribution.length > 0) {
      const topCategory = wardrobeStats.categoryDistribution[0].category;
      insights.push(`Your most owned category is ${topCategory}.`);
    }
  }
  if (outfitStats.totalGenerated > 0 && outfitStats.occasionDistribution.length > 0) {
    const topOccasion = outfitStats.occasionDistribution[0].occasion;
    insights.push(`${topOccasion.charAt(0).toUpperCase() + topOccasion.slice(1)} outfits are your most frequently generated outfits.`);
  }
  return insights;
};

const getWardrobeAnalytics = async (userId, filters) => {
  // Wardrobe metadata shouldn't strictly be bound by the query date range unless explicitly requested, 
  // but we can apply it to `createdAt` if we want to see "wardrobe created in this period".
  // The prompt said: "Do not incorrectly apply date filters to static wardrobe metadata unless logically appropriate."
  const items = await WardrobeItem.find({ user: userId });
  
  const totalItems = items.length;
  const availableItems = items.filter(i => i.isAvailable && !i.isArchived).length;
  const unavailableItems = items.filter(i => !i.isAvailable && !i.isArchived).length;
  const archivedItems = items.filter(i => i.isArchived).length;
  
  const cleanItems = items.filter(i => i.laundryStatus === 'clean' && !i.isArchived).length;
  const dirtyItems = items.filter(i => i.laundryStatus === 'dirty' && !i.isArchived).length;
  const washingItems = items.filter(i => i.laundryStatus === 'washing' && !i.isArchived).length;
  
  const neverWorn = items.filter(i => i.wearCount === 0 && !i.isArchived).length;
  const underusedThreshold = 2;
  const underused = items.filter(i => i.wearCount <= underusedThreshold && i.wearCount > 0 && !i.isArchived).length;
  
  const nonArchivedCount = items.filter(i => !i.isArchived).length;
  const wornItemsCount = items.filter(i => i.wearCount > 0 && !i.isArchived).length;
  const utilizationRate = nonArchivedCount > 0 ? parseFloat(((wornItemsCount / nonArchivedCount) * 100).toFixed(2)) : 0;
  
  const getDist = (field) => {
    const counts = {};
    items.forEach(i => {
      const val = i[field];
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([k, v]) => ({ 
      value: k, count: v, percentage: parseFloat(((v / totalItems) * 100).toFixed(2)) 
    })).sort((a, b) => b.count - a.count);
  };

  const categoryDistribution = getDist('category').map(i => ({ category: i.value, count: i.count, percentage: i.percentage }));
  const colorDistribution = getDist('primaryColor').map(i => ({ color: i.value, count: i.count, percentage: i.percentage }));
  const patternDistribution = getDist('pattern').map(i => ({ pattern: i.value, count: i.count, percentage: i.percentage }));
  const materialDistribution = getDist('material').map(i => ({ material: i.value, count: i.count, percentage: i.percentage }));
  const formalityDistribution = getDist('formality').map(i => ({ formality: i.value, count: i.count, percentage: i.percentage }));

  const aestheticsCounts = {};
  items.forEach(i => {
    if (i.aesthetics) i.aesthetics.forEach(a => aestheticsCounts[a] = (aestheticsCounts[a] || 0) + 1);
  });
  const aestheticDistribution = Object.entries(aestheticsCounts).map(([k, v]) => ({ 
    aesthetic: k, count: v, percentage: parseFloat(((v / totalItems) * 100).toFixed(2)) 
  })).sort((a, b) => b.count - a.count);

  const sortedByWear = [...items.filter(i => !i.isArchived && i.wearCount > 0)].sort((a, b) => b.wearCount - a.wearCount);
  const mostWornItems = sortedByWear.slice(0, 5).map(i => ({ name: i.name, category: i.category, wearCount: i.wearCount, lastWornAt: i.lastWornAt }));
  const leastWornItems = [...sortedByWear].sort((a, b) => a.wearCount - b.wearCount).slice(0, 5).map(i => ({ name: i.name, category: i.category, wearCount: i.wearCount, lastWornAt: i.lastWornAt }));

  return {
    totalItems,
    availableItems,
    unavailableItems,
    archivedItems,
    cleanItems,
    dirtyItems,
    washingItems,
    neverWorn,
    underused,
    utilizationRate,
    categoryDistribution,
    colorDistribution,
    patternDistribution,
    materialDistribution,
    formalityDistribution,
    aestheticDistribution,
    mostWornItems,
    leastWornItems
  };
};

const getOutfitAnalytics = async (userId, filters) => {
  const query = { user: userId };
  if (filters.from || filters.to) {
    query.generatedAt = {};
    if (filters.from) query.generatedAt.$gte = new Date(filters.from);
    if (filters.to) query.generatedAt.$lte = new Date(filters.to);
  }

  const outfits = await Outfit.find(query);
  const totalGenerated = outfits.length;
  
  const totalSaved = outfits.filter(o => o.saved).length;
  const totalWorn = outfits.filter(o => o.status === 'worn').length;
  const totalRejected = outfits.filter(o => o.status === 'rejected').length;
  const totalLiked = outfits.filter(o => o.liked === true).length;
  const totalDisliked = outfits.filter(o => o.liked === false).length;

  const acceptanceCount = outfits.filter(o => o.saved || o.status === 'worn').length;
  const acceptanceRate = totalGenerated > 0 ? parseFloat(((acceptanceCount / totalGenerated) * 100).toFixed(2)) : 0;
  const saveRate = totalGenerated > 0 ? parseFloat(((totalSaved / totalGenerated) * 100).toFixed(2)) : 0;
  const wearRate = totalGenerated > 0 ? parseFloat(((totalWorn / totalGenerated) * 100).toFixed(2)) : 0;

  const getDist = (arr, field) => {
    const counts = {};
    arr.forEach(i => {
      const val = i[field] || 'unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([k, v]) => ({ [field]: k, count: v })).sort((a, b) => b.count - a.count);
  };

  const occasionDistribution = getDist(outfits, 'occasion');
  const sourceDistribution = getDist(outfits, 'source');
  const statusDistribution = getDist(outfits, 'status');
  const aestheticDistribution = getDist(outfits, 'aesthetic');

  return {
    totalGenerated,
    totalSaved,
    totalWorn,
    totalRejected,
    totalLiked,
    totalDisliked,
    acceptanceRate,
    saveRate,
    wearRate,
    occasionDistribution,
    sourceDistribution,
    statusDistribution,
    aestheticDistribution
  };
};

const getStyleAnalytics = async (userId, filters) => {
  const profile = await StyleProfile.findOne({ user: userId });
  if (!profile) return null;

  return {
    explicitPreferences: {
      preferredColors: profile.preferredColors || [],
      avoidedColors: profile.avoidedColors || [],
      preferredFits: profile.preferredFits || [],
      preferredAesthetics: profile.preferredAesthetics || [],
      experimentalLevel: profile.experimentalLevel || 'medium'
    },
    learnedPreferences: profile.learnedPreferences || {
      colors: [],
      fits: [],
      patterns: [],
      materials: [],
      aesthetics: []
    }
  };
};

const getAnalyticsOverview = async (userId, filters) => {
  const wardrobe = await getWardrobeAnalytics(userId, filters);
  const outfits = await getOutfitAnalytics(userId, filters);
  
  const feedbackQuery = { user: userId };
  if (filters.from || filters.to) {
    feedbackQuery.createdAt = {};
    if (filters.from) feedbackQuery.createdAt.$gte = new Date(filters.from);
    if (filters.to) feedbackQuery.createdAt.$lte = new Date(filters.to);
  }
  const feedback = await Feedback.find(feedbackQuery);
  const totalFeedback = feedback.length;
  const likes = feedback.filter(f => f.rating === 'like').length;
  const dislikes = feedback.filter(f => f.rating === 'dislike').length;

  const weeklyQuery = { user: userId };
  if (filters.from || filters.to) {
    weeklyQuery.createdAt = {};
    if (filters.from) weeklyQuery.createdAt.$gte = new Date(filters.from);
    if (filters.to) weeklyQuery.createdAt.$lte = new Date(filters.to);
  }
  const plans = await WeeklyPlan.find(weeklyQuery);
  const plansGenerated = plans.length;
  let plannedDays = 0, completedDays = 0, skippedDays = 0;
  plans.forEach(p => {
    p.days.forEach(d => {
      plannedDays++;
      if (d.status === 'worn') completedDays++;
      if (d.status === 'skipped') skippedDays++;
    });
  });
  const completionRate = plannedDays > 0 ? parseFloat(((completedDays / plannedDays) * 100).toFixed(2)) : 0;

  const inspQuery = { user: userId };
  if (filters.from || filters.to) {
    inspQuery.createdAt = {};
    if (filters.from) inspQuery.createdAt.$gte = new Date(filters.from);
    if (filters.to) inspQuery.createdAt.$lte = new Date(filters.to);
  }
  const inspirations = await Inspiration.find(inspQuery);
  const totalInspirations = inspirations.length;
  const analyzedInspirations = inspirations.filter(i => i.analysis && i.analysis.analyzed).length;

  const insights = generateInsights(wardrobe, outfits);

  return {
    wardrobe: {
      totalItems: wardrobe.totalItems,
      utilizationRate: wardrobe.utilizationRate,
      neverWorn: wardrobe.neverWorn,
      underused: wardrobe.underused
    },
    outfits: {
      generated: outfits.totalGenerated,
      saved: outfits.totalSaved,
      worn: outfits.totalWorn,
      acceptanceRate: outfits.acceptanceRate
    },
    feedback: {
      total: totalFeedback,
      likes,
      dislikes
    },
    weeklyPlan: {
      plansGenerated,
      completionRate
    },
    inspiration: {
      total: totalInspirations,
      analyzed: analyzedInspirations
    },
    insights
  };
};

module.exports = {
  getWardrobeAnalytics,
  getOutfitAnalytics,
  getStyleAnalytics,
  getAnalyticsOverview
};
