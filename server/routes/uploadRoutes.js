const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');

const aiService = require('../services/ai/aiService');

// Use memory storage so we can convert buffer to base64
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Convert buffer to data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'wardrobe_ai_items',
      resource_type: 'auto'
    });
    
    // Auto-detect clothing properties using Gemini Vision
    const analysis = await aiService.analyzeClothing({
      name: 'Uploaded item',
      category: 'top', // Fallback, will be overridden by Gemini
      imageUrl: result.secure_url
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { url: result.secure_url, analysis }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

module.exports = router;
