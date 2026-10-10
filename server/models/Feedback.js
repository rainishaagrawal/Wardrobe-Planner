const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  outfit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outfit",
    required: true
  },
  type: {
    type: String,
    enum: ["outfit", "item"],
    default: "outfit"
  },
  rating: {
    type: String,
    enum: ["like", "dislike", "skip"],
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  context: {
    source: String,
    occasion: String,
    mood: String,
    aesthetic: String
  },
  learningSnapshot: [{
    type: { type: String },
    value: { type: String },
    contribution: { type: Number }
  }]
}, { timestamps: true });

feedbackSchema.index({ user: 1, outfit: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
