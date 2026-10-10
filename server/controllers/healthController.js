const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getHealth = (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const databaseStatus = isConnected ? 'connected' : 'disconnected';
    
    return successResponse(res, 'API is healthy', { database: databaseStatus });
  } catch (error) {
    return errorResponse(res, 'Health check failed', 500);
  }
};

module.exports = { getHealth };
