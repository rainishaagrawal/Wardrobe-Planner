const analyzeClothing = (input) => {
  const text = (input.name || '').toLowerCase();

  const result = {
    category: 'top',
    subcategory: null,
    primaryColor: 'unknown',
    secondaryColors: [],
    pattern: 'solid',
    material: null,
    fit: 'regular',
    formality: 'casual',
    season: ['all'],
    weatherSuitability: {
      minTemperature: 15,
      maxTemperature: 30,
      rainSuitable: false
    },
    aesthetics: ['casual'],
    genderNeutral: true,
    confidence: 0.85
  };

  // Color
  const colors = ['black', 'white', 'grey', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'beige', 'cream'];
  for (const color of colors) {
    if (text.includes(color)) {
      result.primaryColor = color;
      break;
    }
  }

  // Material
  const materials = ['cotton', 'denim', 'linen', 'wool', 'leather', 'polyester', 'rayon'];
  for (const mat of materials) {
    if (text.includes(mat)) {
      result.material = mat;
      break;
    }
  }

  // Pattern
  const patterns = ['stripe', 'striped', 'check', 'checked', 'plaid', 'floral', 'graphic', 'printed', 'geometric'];
  for (const pat of patterns) {
    if (text.includes(pat)) {
      result.pattern = pat.includes('stripe') ? 'stripes' : pat.includes('check') ? 'checks' : pat;
      break;
    }
  }

  // Fit
  const fits = ['slim', 'regular', 'relaxed', 'oversized', 'straight', 'wide', 'tailored'];
  for (const f of fits) {
    if (text.includes(f)) {
      result.fit = f;
      break;
    }
  }

  // Subcategory & Category
  if (text.match(/t-shirt|tee|shirt|polo|top/)) {
    result.category = 'top';
    result.subcategory = text.includes('polo') ? 'polo' : text.includes('shirt') ? 'shirt' : 't-shirt';
    if (text.includes('t-shirt') || text.includes('tee')) result.subcategory = 't-shirt';
    result.season = ['summer', 'spring', 'all'];
    result.weatherSuitability = { minTemperature: 20, maxTemperature: 35, rainSuitable: false };
  } else if (text.match(/hoodie|sweatshirt/)) {
    result.category = 'top';
    result.subcategory = text.includes('hoodie') ? 'hoodie' : 'sweatshirt';
    result.season = ['autumn', 'winter', 'spring'];
    result.weatherSuitability = { minTemperature: 12, maxTemperature: 25, rainSuitable: false };
  } else if (text.match(/jeans|trousers|pants|shorts|chinos|cargo|skirt/)) {
    result.category = 'bottom';
    if (text.includes('jeans')) result.subcategory = 'jeans';
    else if (text.includes('shorts')) {
      result.subcategory = 'shorts';
      result.weatherSuitability = { minTemperature: 22, maxTemperature: 38, rainSuitable: false };
    } else if (text.includes('chinos')) result.subcategory = 'chinos';
  } else if (text.match(/dress|gown/)) {
    result.category = 'dress';
    result.subcategory = 'dress';
    result.formality = 'smartCasual';
  } else if (text.match(/jacket|blazer|coat|overshirt|cardigan/)) {
    result.category = 'outerwear';
    if (text.includes('blazer')) {
      result.subcategory = 'blazer';
      result.formality = 'smartCasual';
    } else if (text.includes('coat')) {
      result.subcategory = 'coat';
      result.season = ['winter'];
      result.weatherSuitability = { minTemperature: -5, maxTemperature: 15, rainSuitable: false };
    } else if (text.includes('jacket')) {
      result.subcategory = 'jacket';
      if (text.includes('rain')) result.weatherSuitability.rainSuitable = true;
    }
  } else if (text.match(/sneakers|shoes|loafers|boots|sandals|heels/)) {
    result.category = 'shoes';
    if (text.includes('sneakers')) result.subcategory = 'sneakers';
    else if (text.includes('loafers')) {
      result.subcategory = 'loafers';
      result.formality = 'smartCasual';
    } else if (text.includes('boots')) {
      result.subcategory = 'boots';
      result.season = ['autumn', 'winter'];
    }
  } else if (text.match(/belt|watch|bag|cap|hat|scarf|accessory/)) {
    result.category = 'accessory';
  }

  // Aesthetics logic
  const aesthetics = [];
  if (result.primaryColor === 'black' && (result.pattern === 'solid' || !result.pattern)) aesthetics.push('minimal');
  if (result.fit === 'oversized' || result.subcategory === 'hoodie' || result.subcategory === 'sneakers') aesthetics.push('streetwear');
  if (result.formality === 'smartCasual') aesthetics.push('smartCasual');
  if (aesthetics.length === 0) aesthetics.push('casual');
  
  result.aesthetics = aesthetics;

  return result;
};

module.exports = { analyzeClothing };
