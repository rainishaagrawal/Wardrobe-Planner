const keywordMap = {
  colors: ['black', 'white', 'grey', 'gray', 'beige', 'cream', 'brown', 'navy', 'blue', 'lightBlue', 'green', 'olive', 'red', 'pink', 'yellow', 'orange', 'purple'],
  garments: ['shirt', 'tshirt', 'tee', 'polo', 'hoodie', 'sweater', 'jacket', 'blazer', 'coat', 'trousers', 'pants', 'jeans', 'shorts', 'skirt', 'dress', 'sneakers', 'shoes', 'loafers', 'boots', 'sandals'],
  fits: ['oversized', 'relaxed', 'regular', 'slim', 'straight', 'wide', 'tailored'],
  patterns: ['solid', 'stripe', 'striped', 'check', 'checked', 'plaid', 'floral', 'graphic', 'printed'],
  materials: ['cotton', 'linen', 'wool', 'denim', 'leather', 'silk', 'polyester'],
  aesthetics: ['minimal', 'oldMoney', 'streetwear', 'smartCasual', 'casual', 'formal', 'athleisure', 'bohemian', 'preppy', 'monochrome', 'classic']
};

const seasonMap = {
  summer: ['summer', 'hot', 'light', 'linen', 'tshirt', 'sandals', 'shorts'],
  winter: ['winter', 'coat', 'wool', 'sweater', 'jacket', 'boots'],
  spring: ['spring', 'light jacket', 'pastel'],
  autumn: ['autumn', 'brown', 'layering', 'jacket']
};

const determineFormality = (garments) => {
  const g = garments.join(' ');
  if (g.includes('blazer') && (g.includes('trousers') || g.includes('dress'))) return 'formal';
  if (g.includes('shirt') && (g.includes('chinos') || g.includes('trousers') || g.includes('loafers'))) return 'smartCasual';
  if (g.includes('dress') && (g.includes('shoes') || g.includes('loafers'))) return 'smartCasual';
  return 'casual';
};

const determineWeather = (garments, materials, seasons) => {
  const allText = garments.join(' ') + ' ' + materials.join(' ') + ' ' + seasons.join(' ');
  if (allText.includes('wool') || allText.includes('coat') || allText.includes('winter')) {
    return { minTemperature: -10, maxTemperature: 15, rainSuitable: true };
  }
  if (allText.includes('linen') || allText.includes('summer') || allText.includes('tshirt') || allText.includes('shorts')) {
    return { minTemperature: 20, maxTemperature: 40, rainSuitable: false };
  }
  return { minTemperature: 10, maxTemperature: 25, rainSuitable: true };
};

const analyzeInspirationDeterministic = (inspiration) => {
  const textToScan = [inspiration.title, inspiration.notes, ...(inspiration.tags || []), inspiration.imageUrl, inspiration.sourceUrl].join(' ').toLowerCase();

  const extract = (category) => keywordMap[category].filter(kw => textToScan.includes(kw.toLowerCase()));
  
  const colors = extract('colors');
  const garments = extract('garments');
  const fits = extract('fits');
  const patterns = extract('patterns');
  const materials = extract('materials');
  const aesthetics = extract('aesthetics');

  const season = [];
  for (const [s, kws] of Object.entries(seasonMap)) {
    if (kws.some(kw => textToScan.includes(kw))) {
      season.push(s);
    }
  }

  const formality = determineFormality(garments);
  const weatherSuitability = determineWeather(garments, materials, season);

  const totalFound = colors.length + garments.length + fits.length + patterns.length + materials.length + aesthetics.length;
  const confidence = Math.min(1.0, 0.2 + (totalFound * 0.05));

  const mainAesthetic = aesthetics[0] || 'mixed';
  const mainColorStr = colors.slice(0, 2).join('-and-') || 'mixed-toned';
  const mainFit = fits[0] || 'regular';
  
  const styleDescription = `${mainAesthetic.charAt(0).toUpperCase() + mainAesthetic.slice(1)} ${mainColorStr} ${formality} outfit with ${mainFit} proportions.`;

  return {
    analyzed: true,
    confidence,
    colors,
    secondaryColors: colors.slice(1),
    garments,
    patterns: patterns.length > 0 ? patterns : ['solid'],
    materials,
    fits,
    aesthetics,
    formality,
    season,
    weatherSuitability,
    styleDescription,
    analyzedAt: new Date()
  };
};

module.exports = { analyzeInspirationDeterministic };
