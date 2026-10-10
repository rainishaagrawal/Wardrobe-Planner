const { calculateColorCompatibility, calculateFormalityCompatibility, calculateAestheticCompatibility } = require('./compatibilityEngine');

const scoreOutfit = (items, context, weather, styleProfile) => {
  // 1. userPreference (0 to 1)
  let explicitScore = 0.5;
  const preferredColors = styleProfile.preferredColors || [];
  const preferredFits = styleProfile.preferredFits || [];
  const matchColors = items.filter(i => preferredColors.includes(i.primaryColor)).length;
  const matchFits = items.filter(i => preferredFits.includes(i.fit)).length;
  explicitScore = Math.min(1.0, 0.5 + (matchColors + matchFits) * 0.1);

  let learnedScore = 0.5;
  if (styleProfile.learnedPreferences) {
    let totalLearnedCont = 0;
    let attrsChecked = 0;
    
    for (const item of items) {
      if (item.primaryColor && styleProfile.learnedPreferences.colors) {
        const l = styleProfile.learnedPreferences.colors.find(c => c.value === item.primaryColor);
        if (l) { totalLearnedCont += l.score * l.confidence; attrsChecked++; }
      }
      if (item.fit && styleProfile.learnedPreferences.fits) {
        const l = styleProfile.learnedPreferences.fits.find(c => c.value === item.fit);
        if (l) { totalLearnedCont += l.score * l.confidence; attrsChecked++; }
      }
      if (item.pattern && styleProfile.learnedPreferences.patterns) {
        const l = styleProfile.learnedPreferences.patterns.find(c => c.value === item.pattern);
        if (l) { totalLearnedCont += l.score * l.confidence; attrsChecked++; }
      }
      if (item.aesthetics && styleProfile.learnedPreferences.aesthetics) {
        item.aesthetics.forEach(a => {
          const l = styleProfile.learnedPreferences.aesthetics.find(c => c.value === a);
          if (l) { totalLearnedCont += l.score * l.confidence; attrsChecked++; }
        });
      }
    }
    
    if (attrsChecked > 0) {
      const avg = totalLearnedCont / attrsChecked; 
      learnedScore = 0.5 + (avg * 0.5); // shift [-1,1] back to roughly [0,1]
    }
  }

  const prefScore = (explicitScore * 0.70) + (learnedScore * 0.30); let inspirationBonus = 0; try { if (context.inspiration && context.inspiration.analysis) { const insp = context.inspiration.analysis; let matchCount = 0; items.forEach(i => { if (i && i.primaryColor && insp.colors && Array.isArray(insp.colors)) { const pColor = String(i.primaryColor).toLowerCase(); if (insp.colors.some(c => c && String(c).toLowerCase() === pColor)) matchCount += 2.5; } if (i && i.category && insp.garments && Array.isArray(insp.garments)) { const iCat = String(i.category).toLowerCase(); if (insp.garments.some(g => g && String(g).toLowerCase().includes(iCat))) matchCount += 1.5; } }); inspirationBonus = matchCount * 15; } } catch (e) { console.error('Error calculating inspiration score', e); }

  // 2. aestheticMatch (0 to 1)
  const aestheticMatch = calculateAestheticCompatibility(items, context.aesthetic, styleProfile);

  // 3. weatherMatch (0 to 1)
  let weatherMatch = 1.0;
  for (const item of items) {
    if (item.weatherSuitability) {
      if (item.weatherSuitability.minTemperature && weather.temperature < item.weatherSuitability.minTemperature) weatherMatch -= 0.2;
      if (item.weatherSuitability.maxTemperature && weather.temperature > item.weatherSuitability.maxTemperature) weatherMatch -= 0.2;
    }
  }
  weatherMatch = Math.max(0, weatherMatch);

  // 4. occasionMatch (0 to 1)
  const occasionMatch = calculateFormalityCompatibility(items, context.occasion); let moodMatch = 1.0; if (context.mood === 'comfortable' || context.mood === 'relaxed') { moodMatch = items.some(i => ['loose', 'oversized', 'relaxed'].includes(i.fit)) ? 1.0 : 0.5; }

  // 5. colorCompatibility (0 to 1)
  const colorCompatibility = calculateColorCompatibility(items);

  // 6. novelty (0 to 1)
  const now = new Date();
  let novelty = 1.0;
  for (const item of items) {
    const ageInDays = item.createdAt ? (now - new Date(item.createdAt)) / (1000 * 3600 * 24) : 999;
    
    if (ageInDays < 2) {
      novelty += 2.0; // HUGE boost for newly added items (last 48 hours)
    } else if (item.lastWornAt) {
      const daysSinceWorn = (now - new Date(item.lastWornAt)) / (1000 * 3600 * 24);
      if (daysSinceWorn < 3) novelty -= 0.3;
      else if (daysSinceWorn > 30) novelty += 0.1;
    } else {
      novelty += 0.2;
    }
  }
  novelty = Math.max(0, Math.min(1.0, novelty));

  // 7. wardrobeUtilization (0 to 1)
  let utilization = 0.5;
  const totalWear = items.reduce((sum, item) => sum + (item.wearCount || 0), 0);
  if (totalWear === 0) utilization = 1.0;
  else if (totalWear < 5) utilization = 0.8;
  else utilization = 0.4;

  const scoreBreakdown = {
    userPreference: prefScore,
    aestheticMatch,
    weatherMatch,
    occasionMatch,
    colorCompatibility,
    novelty,
    wardrobeUtilization: utilization
  };

  let finalScore = 
    (prefScore * 25) + 
    (aestheticMatch * 20) + 
    (weatherMatch * 20) + 
    (occasionMatch * 10) + (moodMatch * 5) + 
    (colorCompatibility * 10) + 
    (novelty * 5) + 
    (utilization * 5) + inspirationBonus; if (colorCompatibility <= 0.4) finalScore *= 0.1;

  return {
    score: parseFloat(finalScore.toFixed(2)),
    scoreBreakdown
  };
};

module.exports = { scoreOutfit };


