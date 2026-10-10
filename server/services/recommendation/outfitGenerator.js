const generateCandidates = (filteredItems) => {
  const tops = filteredItems.filter(i => i.category === 'top');
  const bottoms = filteredItems.filter(i => i.category === 'bottom');
  const dresses = filteredItems.filter(i => i.category === 'dress');
  const outerwears = filteredItems.filter(i => i.category === 'outerwear');
  const shoes = filteredItems.filter(i => i.category === 'shoes');
  const accessories = filteredItems.filter(i => i.category === 'accessory');

  const candidates = [];
  let topBottomCount = 0;
  let dressCount = 0;
  const MAX_PER_TYPE = 500;

  // Helper to safely add combinations without exploding exponentially
  const expandOutfit = (baseOutfit, type) => { if (type === 'tb' && topBottomCount >= MAX_PER_TYPE) return; if (type === 'dress' && dressCount >= MAX_PER_TYPE) return; candidates.push([...baseOutfit]); if (type === 'tb') topBottomCount++; else dressCount++; if (outerwears.length > 0) { for (const ow of outerwears) { if ((type === 'tb' ? topBottomCount : dressCount) >= MAX_PER_TYPE) break; candidates.push([...baseOutfit, ow]); if (type === 'tb') topBottomCount++; else dressCount++; } } if (accessories.length > 0) { for (const acc of accessories) { if ((type === 'tb' ? topBottomCount : dressCount) >= MAX_PER_TYPE) break; candidates.push([...baseOutfit, acc]); if (type === 'tb') topBottomCount++; else dressCount++; } } };

  // Top + Bottom combinations
  for (const top of tops) {
    if (topBottomCount >= MAX_PER_TYPE) break;
    for (const bottom of bottoms) {
      if (topBottomCount >= MAX_PER_TYPE) break;
      const shoeList = shoes.length > 0 ? shoes : [null];
      for (const shoe of shoeList) {
        if (topBottomCount >= MAX_PER_TYPE) break;
        const baseOutfit = [top, bottom];
        if (shoe) baseOutfit.push(shoe);
        expandOutfit(baseOutfit, 'tb');
      }
    }
  }

  // Dress combinations
  for (const dress of dresses) {
    if (dressCount >= MAX_PER_TYPE) break;
    const shoeList = shoes.length > 0 ? shoes : [null];
    for (const shoe of shoeList) {
      if (dressCount >= MAX_PER_TYPE) break;
      const baseOutfit = [dress];
      if (shoe) baseOutfit.push(shoe);
      expandOutfit(baseOutfit, 'dress');
    }
  }

  return candidates;
};

module.exports = { generateCandidates };

