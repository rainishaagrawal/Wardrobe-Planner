const User = require('../models/User');

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

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return sanitizeUser(user);
};

const updateProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'location', 'timezone', 'profileImage', 'onboardingCompleted'];
  const dataToUpdate = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });
  if (!updatedUser) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return sanitizeUser(updatedUser);
};

module.exports = { getProfile, updateProfile };
