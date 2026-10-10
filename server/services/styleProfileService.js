const StyleProfile = require('../models/StyleProfile');

const defaultProfile = {
  aesthetics: [
    { name: 'minimal', score: 0.5 },
    { name: 'smartCasual', score: 0.5 }
  ],
  preferredColors: [],
  avoidedColors: [],
  preferredFits: [],
  preferredPatterns: ['solid'],
  preferredMaterials: [],
  preferredShoes: [],
  formality: {
    casual: 0.5,
    smartCasual: 0.5,
    formal: 0.5
  },
  comfort: 0.5,
  modesty: 0.5,
  temperaturePreference: 'neutral',
  experimentalLevel: 0.5,
  styleGoals: [],
  explicitPreferences: [],
  learnedPreferences: {
    colors: [],
    fits: [],
    patterns: [],
    materials: [],
    aesthetics: []
  },
  temporaryPreferences: []
};

const cleanExpiredPreferences = (profile) => {
  const now = new Date();
  profile.temporaryPreferences = profile.temporaryPreferences.filter(pref => pref.expiresAt > now);
  return profile;
};

const WardrobeItem = require('../models/WardrobeItem');

const getOrCreateStyleProfile = async (userId) => {
  let profile = await StyleProfile.findOne({ user: userId });
  if (!profile) {
    profile = await StyleProfile.create({ user: userId, ...defaultProfile });
  } else {
    const hasExpired = profile.temporaryPreferences.some(pref => pref.expiresAt <= new Date());
    if (hasExpired) {
      profile = cleanExpiredPreferences(profile);
      await profile.save();
    }
  }

  // Convert to object so we can inject live computed DNA
  const profileObj = profile.toObject();

  // Compute live Style DNA from the user's wardrobe items
  const items = await WardrobeItem.find({ user: userId });
  if (items.length > 0) {
    const tally = {};
    let total = 0;
    items.forEach(item => {
      if (item.aesthetics && item.aesthetics.length > 0) {
        item.aesthetics.forEach(a => {
          tally[a] = (tally[a] || 0) + 1;
          total++;
        });
      }
    });

    if (total > 0) {
      const topAesth = Object.keys(tally).map(name => ({
        name, 
        score: tally[name] / total
      })).sort((a, b) => b.score - a.score).slice(0, 5);
      
      profileObj.aesthetics = topAesth; // Override with live DNA
    }
  }

  return profileObj;
};

const updateStyleProfile = async (userId, updateData) => {
  let profile = await StyleProfile.findOne({ user: userId });
  if (!profile) {
    profile = await StyleProfile.create({ user: userId, ...defaultProfile });
  }

  const allowedFields = [
    'aesthetics', 'preferredColors', 'avoidedColors', 'preferredFits', 'preferredPatterns',
    'preferredMaterials', 'preferredShoes', 'formality', 'comfort', 'modesty',
    'temperaturePreference', 'experimentalLevel', 'styleGoals', 'explicitPreferences'
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      profile[field] = updateData[field];
    }
  }

  await profile.save();
  return cleanExpiredPreferences(profile);
};

const addTemporaryPreference = async (userId, preferenceData) => {
  let profile = await StyleProfile.findOne({ user: userId });
  if (!profile) {
    profile = await StyleProfile.create({ user: userId, ...defaultProfile });
  }
  profile.temporaryPreferences.push(preferenceData);
  await profile.save();
  return cleanExpiredPreferences(profile);
};

const removeTemporaryPreference = async (userId, prefId) => {
  let profile = await StyleProfile.findOne({ user: userId });
  if (!profile) {
    const error = new Error('Style profile not found');
    error.status = 404;
    throw error;
  }
  profile.temporaryPreferences = profile.temporaryPreferences.filter(pref => pref._id.toString() !== prefId);
  await profile.save();
  return cleanExpiredPreferences(profile);
};

module.exports = { 
  getOrCreateStyleProfile, 
  updateStyleProfile, 
  addTemporaryPreference, 
  removeTemporaryPreference 
};
