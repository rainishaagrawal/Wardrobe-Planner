const calculateColorCompatibility = (items) => {
  const colors = items.map(i => i.primaryColor);
  const neutralColors = ['black', 'white', 'grey', 'gray', 'navy', 'beige', 'brown', 'cream'];
  
  let neutralsCount = colors.filter(c => neutralColors.includes(c)).length;
  
  if (neutralsCount === colors.length) return 0.9;
  if (neutralsCount >= colors.length - 1) return 0.8;
  return 0.4;
};

const calculateFormalityCompatibility = (items, occasion) => {
  const occasionMap = {
    work: 2, office: 2, date: 2, nightout: 2, party: 2, event: 3, casual: 1
  };
  const formalityScores = { casual: 1, smartCasual: 2, formal: 3 };
  
  const target = occasion ? (occasionMap[occasion.toLowerCase()] || 1) : 1;

  let totalDiff = 0;
  for (const item of items) {
    const itemScore = formalityScores[item.formality] || 1;
    totalDiff += Math.abs(target - itemScore);
  }

  const avgDiff = items.length > 0 ? totalDiff / items.length : 0;
  if (avgDiff === 0) return 1.0;
  if (avgDiff <= 0.5) return 0.8;
  if (avgDiff <= 1.0) return 0.5;
  return 0.1;
};

const calculateAestheticCompatibility = (items, targetAesthetic, styleProfile) => {
  let matchCount = 0;
  for (const item of items) {
    if (targetAesthetic && item.aesthetics && item.aesthetics.includes(targetAesthetic)) {
      matchCount++;
    } else if (styleProfile.aesthetics && styleProfile.aesthetics.length > 0) {
      const userAesth = styleProfile.aesthetics.map(a => a.name);
      if (item.aesthetics && item.aesthetics.some(a => userAesth.includes(a))) matchCount++;
    }
  }
  return items.length > 0 ? matchCount / items.length : 0.5;
};

module.exports = { calculateColorCompatibility, calculateFormalityCompatibility, calculateAestheticCompatibility };
