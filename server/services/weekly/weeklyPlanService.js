const WeeklyPlan = require('../../models/WeeklyPlan');
const Outfit = require('../../models/Outfit');
const recommendationService = require('../recommendation/recommendationService');
const { calculateWeeklyVarietyAdjustment } = require('./weeklyVarietyService');
const outfitService = require('../outfit/outfitService');
const weatherService = require('../weather/weatherService');

const getStartOfWeek = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(date.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfWeek = (startOfWeek) => {
  const end = new Date(startOfWeek);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

const generateMockWeatherForDate = async (userId, date) => {
  const base = await weatherService.getCurrentWeather(userId);
  const offset = date.getDay() % 3;
  return {
    ...base,
    temperature: base.temperature + offset - 1,
    feelsLike: base.feelsLike + offset - 1
  };
};

const generateWeeklyPlan = async (userId, params) => {
  const { weekStart: reqWeekStart, days: reqDays = {} } = params;
  const weekStart = getStartOfWeek(reqWeekStart);
  const weekEnd = getEndOfWeek(weekStart);

  let plan = await WeeklyPlan.findOne({ user: userId, weekStart });
  if (plan) {
    return plan.populate({ path: 'days.outfit', populate: { path: 'items' } });
  }

  plan = new WeeklyPlan({ user: userId, weekStart, weekEnd, days: [] });
  
  const weeklyContext = {
    usedItemIds: [],
    usedOutfitKeys: [],
    recentColors: [],
    recentCategories: []
  };

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(currentDate.getDate() + i);
    const dayOfWeek = dayNames[currentDate.getDay()];

    const reqDay = reqDays[dayOfWeek] || {};
    const occasion = reqDay.occasion || 'casual';
    const mood = reqDay.mood || null;
    const aesthetic = reqDay.aesthetic || null;

    const weatherSnapshot = await generateMockWeatherForDate(userId, currentDate);

    const recs = await recommendationService.generateRecommendations(userId, { occasion, mood, aesthetic, limit: 20 });
    
    let bestOutfitCandidate = null;
    let highestScore = -Infinity;

    if (recs.outfits && recs.outfits.length > 0) {
      for (const candidate of recs.outfits) {
        const varietyAdjustment = calculateWeeklyVarietyAdjustment(candidate, weeklyContext);
        const weeklyRandomJitter = Math.random() * 20;
        const adjustedScore = candidate.score + varietyAdjustment + weeklyRandomJitter;
        
        if (adjustedScore > highestScore) {
          highestScore = adjustedScore;
          bestOutfitCandidate = candidate;
        }
      }
    }

    let savedOutfit = null;
    if (bestOutfitCandidate) {
      savedOutfit = await Outfit.create({
        user: userId,
        items: bestOutfitCandidate.items.map(it => it._id),
        occasion,
        mood,
        aesthetic,
        weatherSnapshot,
        score: bestOutfitCandidate.score,
        scoreBreakdown: bestOutfitCandidate.scoreBreakdown,
        source: 'recommendation-engine',
        status: 'suggested',
        saved: true
      });

      const key = bestOutfitCandidate.items.map(it => it._id.toString()).sort().join('_');
      weeklyContext.usedOutfitKeys.push(key);
      for (const item of bestOutfitCandidate.items) {
        weeklyContext.usedItemIds.push(item._id.toString());
        if (item.primaryColor) weeklyContext.recentColors.push(item.primaryColor);
      }
    }

    plan.days.push({
      date: currentDate,
      dayOfWeek,
      occasion,
      mood,
      aesthetic,
      outfit: savedOutfit ? savedOutfit._id : null,
      weatherSnapshot,
      status: 'planned'
    });
  }

  await plan.save();
  return plan.populate({ path: 'days.outfit', populate: { path: 'items' } });
};

const getWeeklyPlan = async (userId, weekStartQuery) => {
  const weekStart = getStartOfWeek(weekStartQuery);
  const plan = await WeeklyPlan.findOne({ user: userId, weekStart }).populate({ path: 'days.outfit', populate: { path: 'items' } });
  if (!plan) throw Object.assign(new Error('Weekly plan not found'), { status: 404 });
  
  const now = new Date();
  if (now > plan.weekEnd && plan.status !== 'completed') {
    plan.status = 'completed';
    await plan.save();
  } else if (now >= plan.weekStart && now <= plan.weekEnd && plan.status !== 'active') {
    plan.status = 'active';
    await plan.save();
  }
  
  return plan;
};

const getWeeklyPlanById = async (userId, id) => {
  const plan = await WeeklyPlan.findOne({ _id: id, user: userId }).populate({ path: 'days.outfit', populate: { path: 'items' } });
  if (!plan) throw Object.assign(new Error('Weekly plan not found'), { status: 404 });
  return plan;
};

const regenerateWeeklyPlanDay = async (userId, planId, dateString) => {
  const plan = await WeeklyPlan.findOne({ _id: planId, user: userId });
  if (!plan) throw Object.assign(new Error('Weekly plan not found'), { status: 404 });
  
  const targetDate = new Date(dateString);
  const dayIndex = plan.days.findIndex(d => d.date.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]);
  if (dayIndex === -1) throw Object.assign(new Error('Date not in this weekly plan'), { status: 400 });
  
  const day = plan.days[dayIndex];
  const oldOutfitId = day.outfit ? day.outfit.toString() : null;

  const recs = await recommendationService.generateRecommendations(userId, { 
    occasion: day.occasion, 
    mood: day.mood, 
    aesthetic: day.aesthetic, 
    limit: 10 
  });

  let bestOutfit = null;
  if (recs.outfits && recs.outfits.length > 0) {
    bestOutfit = recs.outfits[0];
    const key = bestOutfit.items.map(i=>i._id.toString()).sort().join('_');
    if (recs.outfits.length > 1 && oldOutfitId) {
       // if we have the old outfit ID we'd need to compare items array, but let's just pick the second if we want variation.
       bestOutfit = recs.outfits[1]; 
    }
  }

  if (bestOutfit) {
    const savedOutfit = await Outfit.create({
        user: userId,
        items: bestOutfit.items.map(it => it._id),
        occasion: day.occasion,
        mood: day.mood,
        aesthetic: day.aesthetic,
        weatherSnapshot: day.weatherSnapshot,
        score: bestOutfit.score,
        scoreBreakdown: bestOutfit.scoreBreakdown,
        source: 'recommendation-engine',
        status: 'suggested',
        saved: true
    });
    plan.days[dayIndex].outfit = savedOutfit._id;
    await plan.save();
  }
  
  return plan.populate({ path: 'days.outfit', populate: { path: 'items' } });
};

const updateWeeklyPlanDay = async (userId, planId, dateString, updates) => {
  const plan = await WeeklyPlan.findOne({ _id: planId, user: userId });
  if (!plan) throw Object.assign(new Error('Weekly plan not found'), { status: 404 });

  const targetDate = new Date(dateString);
  const dayIndex = plan.days.findIndex(d => d.date.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]);
  if (dayIndex === -1) throw Object.assign(new Error('Date not in this weekly plan'), { status: 400 });

  if (updates.occasion) plan.days[dayIndex].occasion = updates.occasion;
  if (updates.mood) plan.days[dayIndex].mood = updates.mood;
  if (updates.aesthetic) plan.days[dayIndex].aesthetic = updates.aesthetic;
  if (updates.notes) plan.days[dayIndex].notes = updates.notes;

  await plan.save();
  return regenerateWeeklyPlanDay(userId, planId, dateString);
};

const markDayWorn = async (userId, planId, dateString) => {
  const plan = await WeeklyPlan.findOne({ _id: planId, user: userId });
  if (!plan) throw Object.assign(new Error('Weekly plan not found'), { status: 404 });

  const targetDate = new Date(dateString);
  const day = plan.days.find(d => d.date.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]);
  if (!day) throw Object.assign(new Error('Date not in this weekly plan'), { status: 400 });

  if (day.outfit) {
    await outfitService.markOutfitAsWorn(day.outfit, userId);
  }
  
  day.status = 'worn';
  await plan.save();

  return plan.populate({ path: 'days.outfit', populate: { path: 'items' } });
};

const skipPlanDay = async (userId, planId, dateString, reason) => {
  const plan = await WeeklyPlan.findOne({ _id: planId, user: userId });
  if (!plan) throw Object.assign(new Error('Weekly plan not found'), { status: 404 });

  const targetDate = new Date(dateString);
  const day = plan.days.find(d => d.date.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]);
  if (!day) throw Object.assign(new Error('Date not in this weekly plan'), { status: 400 });

  day.status = 'skipped';
  if (reason) {
    day.notes = day.notes ? `${day.notes} | Skipped reason: ${reason}` : `Skipped reason: ${reason}`;
  }
  
  await plan.save();
  return plan.populate({ path: 'days.outfit', populate: { path: 'items' } });
};

module.exports = {
  generateWeeklyPlan,
  getWeeklyPlan,
  getWeeklyPlanById,
  updateWeeklyPlanDay,
  regenerateWeeklyPlanDay,
  markDayWorn,
  skipPlanDay
};

