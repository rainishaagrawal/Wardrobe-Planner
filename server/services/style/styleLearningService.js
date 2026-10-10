const StyleProfile = require('../../models/StyleProfile');

const RATING_WEIGHTS = { 'like': 1.0, 'dislike': -1.0, 'skip': -0.15 };
const LEARNING_RATE = 0.10;

const applyFeedbackLearning = async (userId, attributes, rating) => {
  const weight = RATING_WEIGHTS[rating] || 0;
  if (weight === 0) return [];
  
  const contribution = weight * LEARNING_RATE;
  const snapshot = [];
  
  const profile = await StyleProfile.findOne({ user: userId });
  if (!profile) return snapshot;

  if (!profile.learnedPreferences) {
    profile.learnedPreferences = { colors: [], fits: [], patterns: [], materials: [], aesthetics: [] };
  } else {
    // Ensure nested objects exist
    ['colors', 'fits', 'patterns', 'materials', 'aesthetics'].forEach(k => {
      if (!profile.learnedPreferences[k]) profile.learnedPreferences[k] = [];
    });
  }

  for (const attr of attributes) {
    const { type, value } = attr;
    if (!profile.learnedPreferences[type]) continue;
    
    let pref = profile.learnedPreferences[type].find(p => p.value === value);
    if (!pref) {
      pref = { value, score: 0, confidence: 0, evidenceCount: 0 };
      profile.learnedPreferences[type].push(pref);
    }
    
    pref.score = Math.max(-1, Math.min(1, pref.score + contribution));
    pref.evidenceCount += 1;
    pref.confidence = Math.min(1, pref.evidenceCount / 10);
    
    snapshot.push({ type, value, contribution });
  }
  
  profile.markModified('learnedPreferences');
  await profile.save();
  return snapshot;
};

const reverseFeedbackLearning = async (userId, snapshot) => {
  if (!snapshot || snapshot.length === 0) return;
  
  const profile = await StyleProfile.findOne({ user: userId });
  if (!profile || !profile.learnedPreferences) return;

  for (const snap of snapshot) {
    const { type, value, contribution } = snap;
    if (!profile.learnedPreferences[type]) continue;
    
    let pref = profile.learnedPreferences[type].find(p => p.value === value);
    if (pref) {
      pref.score = Math.max(-1, Math.min(1, pref.score - contribution));
      pref.evidenceCount = Math.max(0, pref.evidenceCount - 1);
      pref.confidence = Math.min(1, pref.evidenceCount / 10);
    }
  }

  profile.markModified('learnedPreferences');
  await profile.save();
};

module.exports = { applyFeedbackLearning, reverseFeedbackLearning };
