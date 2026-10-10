const mongoose = require('mongoose');

const styleProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    aesthetics: [
      {
        name: String,
        score: { type: Number, min: 0, max: 1 }
      }
    ],
    preferredColors: [String],
    avoidedColors: [String],
    preferredFits: [String],
    preferredPatterns: [String],
    preferredMaterials: [String],
    preferredShoes: [String],
    formality: {
      casual: { type: Number, min: 0, max: 1, default: 0.5 },
      smartCasual: { type: Number, min: 0, max: 1, default: 0.5 },
      formal: { type: Number, min: 0, max: 1, default: 0.5 }
    },
    comfort: { type: Number, min: 0, max: 1, default: 0.5 },
    modesty: { type: Number, min: 0, max: 1, default: 0.5 },
    temperaturePreference: {
      type: String,
      enum: ['cold', 'cool', 'neutral', 'warm', 'hot'],
      default: 'neutral'
    },
    experimentalLevel: { type: Number, min: 0, max: 1, default: 0.5 },
    styleGoals: [String],
    explicitPreferences: [
      {
        type: { type: String, enum: ['prefer', 'avoid'] },
        target: String,
        reason: String
      }
    ],
    learnedPreferences: {
      colors: { type: [String], default: [] },
      fits: { type: [String], default: [] },
      patterns: { type: [String], default: [] },
      materials: { type: [String], default: [] },
      aesthetics: { type: [String], default: [] }
    },
    temporaryPreferences: [
      {
        type: { type: String },
        value: String,
        expiresAt: Date
      }
    ]
  },
  { timestamps: true }
);

const StyleProfile = mongoose.model('StyleProfile', styleProfileSchema);

module.exports = StyleProfile;
