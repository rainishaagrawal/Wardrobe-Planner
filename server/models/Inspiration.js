const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  analyzed: { type: Boolean, default: false },
  confidence: { type: Number, default: 0 },
  colors: [String],
  secondaryColors: [String],
  garments: [String],
  patterns: [String],
  materials: [String],
  fits: [String],
  aesthetics: [String],
  formality: String,
  season: [String],
  weatherSuitability: {
    minTemperature: Number,
    maxTemperature: Number,
    rainSuitable: Boolean
  },
  styleDescription: String,
  analyzedAt: Date
}, { _id: false });

const inspirationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  imageUrl: String,
  thumbnailUrl: String,
  source: { type: String, enum: ['upload', 'url', 'manual'], default: 'url' },
  sourceUrl: String,
  title: String,
  notes: String,
  analysis: { type: analysisSchema, default: () => ({ analyzed: false }) },
  tags: [String],
  saved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Inspiration', inspirationSchema);
