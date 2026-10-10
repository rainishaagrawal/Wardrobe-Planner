const inspirationService = require('../services/inspiration/inspirationService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createInspiration = async (req, res, next) => {
  try {
    const data = await inspirationService.createInspiration(req.user.userId, req.body);
    return successResponse(res, 'Inspiration created successfully', data, 201);
  } catch (error) { next(error); }
};

const getInspirations = async (req, res, next) => {
  try {
    const data = await inspirationService.getInspirations(req.user.userId, req.query);
    return successResponse(res, 'Inspirations fetched successfully', data);
  } catch (error) { next(error); }
};

const getInspirationById = async (req, res, next) => {
  try {
    const data = await inspirationService.getInspirationById(req.user.userId, req.params.id);
    return successResponse(res, 'Inspiration fetched successfully', data);
  } catch (error) { 
    if(error.status) return errorResponse(res, error.message, error.status);
    next(error); 
  }
};

const updateInspiration = async (req, res, next) => {
  try {
    const data = await inspirationService.updateInspiration(req.user.userId, req.params.id, req.body);
    return successResponse(res, 'Inspiration updated successfully', data);
  } catch (error) { 
    if(error.status) return errorResponse(res, error.message, error.status);
    next(error); 
  }
};

const deleteInspiration = async (req, res, next) => {
  try {
    await inspirationService.deleteInspiration(req.user.userId, req.params.id);
    return successResponse(res, 'Inspiration deleted successfully', null);
  } catch (error) { 
    if(error.status) return errorResponse(res, error.message, error.status);
    next(error); 
  }
};

const analyzeInspiration = async (req, res, next) => {
  try {
    const data = await inspirationService.analyzeInspiration(req.user.userId, req.params.id);
    return successResponse(res, 'Inspiration analyzed successfully', data);
  } catch (error) { 
    if(error.status) return errorResponse(res, error.message, error.status);
    next(error); 
  }
};

module.exports = {
  createInspiration, getInspirations, getInspirationById, updateInspiration, deleteInspiration, analyzeInspiration
};
