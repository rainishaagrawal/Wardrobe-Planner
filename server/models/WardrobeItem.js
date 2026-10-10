const mongoose = require('mongoose');

const wardrobeItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: { type: String, default: null },
    thumbnailUrl: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory']
    },
    subcategory: { type: String, default: null },
    primaryColor: { type: String, required: true },
    secondaryColors: { type: [String], default: [] },
    pattern: { type: String, default: 'solid' },
    material: { type: String, default: null },
    fit: { type: String, default: null },
    formality: {
      type: String,
      default: 'casual',
      enum: ['casual', 'smartCasual', 'formal']
    },
    season: { type: [String], default: [] },
    weatherSuitability: {
      minTemperature: { type: Number, default: null },
      maxTemperature: { type: Number, default: null },
      rainSuitable: { type: Boolean, default: false }
    },
    aesthetics: { type: [String], default: [] },
    genderNeutral: { type: Boolean, default: true },
    brand: { type: String, default: null },
    size: { type: String, default: null },
    availability: {
      type: String,
      default: 'available',
      enum: ['available', 'unavailable', 'archived']
    },
    laundryStatus: {
      type: String,
      default: 'clean',
      enum: ['clean', 'dirty', 'washing']
    },
    lastWornAt: { type: Date, default: null },
    wearCount: { type: Number, default: 0, min: 0 },
    recommendationStats: {
      timesRecommended: { type: Number, default: 0 },
      timesSelected: { type: Number, default: 0 },
      timesLiked: { type: Number, default: 0 }
    },
    aiAnalysis: {
      analyzed: { type: Boolean, default: false },
      confidence: { type: Number, default: 0 },
      analyzedAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

// Indexes
wardrobeItemSchema.index({ user: 1 });
wardrobeItemSchema.index({ user: 1, category: 1 });
wardrobeItemSchema.index({ user: 1, availability: 1 });
wardrobeItemSchema.index({ user: 1, laundryStatus: 1 });

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema);

module.exports = WardrobeItem;
