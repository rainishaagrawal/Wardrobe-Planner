const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const styleRoutes = require('./routes/styleRoutes');
const wardrobeRoutes = require('./routes/wardrobeRoutes');
const outfitRoutes = require('./routes/outfitRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const weeklyPlanRoutes = require('./routes/weeklyPlanRoutes');
const inspirationRoutes = require('./routes/inspirationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/style', styleRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/weekly-plan', weeklyPlanRoutes);
app.use('/api/inspiration', inspirationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
