const filterWardrobe = (wardrobeItems, context, weather, styleProfile) => {
  return wardrobeItems.filter(item => {
    // 1. Availability
    if (item.availability !== 'available') return false;
    
    // 2. Laundry status
    if (item.laundryStatus !== 'clean') return false;

    // 3. Explicit avoids (permanent)
    if (styleProfile.avoidedColors && styleProfile.avoidedColors.includes(item.primaryColor)) return false;

    // 4. Temporary preferences (avoidColor)
    const avoidColors = (styleProfile.temporaryPreferences || [])
      .filter(p => p.type === 'avoidColor' && new Date(p.expiresAt) > new Date())
      .map(p => p.value);
    if (avoidColors.includes(item.primaryColor)) return false;

    // 5. Weather check (hard filter extreme mismatch)
    if (item.weatherSuitability) {
      if (item.weatherSuitability.minTemperature && weather.temperature < item.weatherSuitability.minTemperature - 10) return false;
      if (item.weatherSuitability.maxTemperature && weather.temperature > item.weatherSuitability.maxTemperature + 10) return false;
      if (weather.rain && item.weatherSuitability.rainSuitable === false && item.category === 'outerwear') return false;
    }

    // 6. Occasion hard mismatch
    if (context.occasion === 'formal' && item.formality === 'casual') return false;
    
    return true;
  });
};

module.exports = { filterWardrobe };
