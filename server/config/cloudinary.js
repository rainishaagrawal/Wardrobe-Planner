require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'jrzxv7ex',
  api_key: process.env.CLOUDINARY_API_KEY || '254486771375217',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'uBhHPKkZlx058ngavvF4n5F0EjA'
});

module.exports = cloudinary;
