require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wardrobe_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_later',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
