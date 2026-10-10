const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem', required: true }],
  occasion: { type: String, default: 'casual' },
  mood: { type: String, default: null },
  aesthetic: { type: String, default: null },
  weatherSnapshot: {
    temperature: Number,
    feelsLike: Number,
    condition: String,
    rain: Boolean
  },
  score: { type: Number, default: 0 },
  scoreBreakdown: {
    userPreference: Number,
    aestheticMatch: Number,
    weatherMatch: Number,
    occasionMatch: Number,
    colorCompatibility: Number,
    novelty: Number,
    wardrobeUtilization: Number
  },
  source: { 
    type: String, 
    default: 'recommendation-engine',
    enum: ['recommendation-engine', 'manual', 'surprise']
  },
  status: {
    type: String,
    default: 'suggested',
    enum: ['suggested', 'saved', 'worn', 'rejected']
  },
  generatedAt: { type: Date, default: Date.now },
  wornAt: { type: Date, default: null },
  saved: { type: Boolean, default: false },
  liked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Outfit', outfitSchema);
