const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayOfWeek: { type: String, required: true },
  occasion: { type: String, default: 'casual' },
  mood: { type: String, default: null },
  aesthetic: { type: String, default: null },
  outfit: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' },
  weatherSnapshot: {
    temperature: Number,
    feelsLike: Number,
    condition: String,
    rain: Boolean
  },
  status: {
    type: String,
    enum: ['planned', 'worn', 'skipped'],
    default: 'planned'
  },
  notes: { type: String, default: null }
});

const weeklyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  days: [daySchema],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'active'
  }
}, { timestamps: true });

weeklyPlanSchema.index({ user: 1, weekStart: 1 }, { unique: true });
weeklyPlanSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('WeeklyPlan', weeklyPlanSchema);
