const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    location: user.location,
    timezone: user.timezone,
    onboardingCompleted: user.onboardingCompleted
  };
};

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.status = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  });

  const token = generateToken(newUser._id);
  return { user: sanitizeUser(newUser), token };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id);
  return { user: sanitizeUser(user), token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return sanitizeUser(user);
};

module.exports = { registerUser, loginUser, getUserById };
