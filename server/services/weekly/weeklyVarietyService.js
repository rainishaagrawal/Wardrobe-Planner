const calculateWeeklyVarietyAdjustment = (candidate, weeklyContext) => {
  const { usedItemIds, usedOutfitKeys, recentColors } = weeklyContext;
  
  const outfitKey = candidate.items.map(i => i._id.toString()).sort().join('_');
  
  let penalty = 0;

  // Exact duplicate outfit within the week (Heavy penalty to force variety)
  if (usedOutfitKeys.includes(outfitKey)) {
    penalty += 100;
  }

  // Individual item reuse
  for (const item of candidate.items) {
    const id = item._id.toString();
    const uses = usedItemIds.filter(usedId => usedId === id).length;
    if (uses > 0) {
      penalty += (uses * 15);
    }
    
    // Color repetition
    if (item.primaryColor) {
      const colorUses = recentColors.filter(c => c === item.primaryColor).length;
      if (colorUses > 2) {
        penalty += 2;
      }
    }
  }

  // Return negative penalty (un-capped so variety actually works)
  return -penalty;
};

module.exports = { calculateWeeklyVarietyAdjustment };
