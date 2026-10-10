const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    timezone: {
      type: String,
      default: null
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
