const wardrobeService = require('../services/wardrobeService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createItem = async (req, res, next) => {
  try {
    const item = await wardrobeService.createWardrobeItem(req.user.userId, req.body);
    return successResponse(res, 'Wardrobe item created successfully', { item }, 201);
  } catch (error) {
    next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const data = await wardrobeService.getWardrobeItems(req.user.userId, req.query);
    return successResponse(res, 'Wardrobe fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

const getItem = async (req, res, next) => {
  try {
    const item = await wardrobeService.getWardrobeItem(req.user.userId, req.params.id);
    return successResponse(res, 'Wardrobe item fetched successfully', { item });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await wardrobeService.updateWardrobeItem(req.user.userId, req.params.id, req.body);
    return successResponse(res, 'Wardrobe item updated successfully', { item });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    await wardrobeService.deleteWardrobeItem(req.user.userId, req.params.id);
    return successResponse(res, 'Wardrobe item deleted successfully');
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const item = await wardrobeService.updateAvailability(req.user.userId, req.params.id, req.body.availability);
    return successResponse(res, 'Availability updated successfully', { item });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const updateLaundryStatus = async (req, res, next) => {
  try {
    const item = await wardrobeService.updateLaundryStatus(req.user.userId, req.params.id, req.body.laundryStatus);
    return successResponse(res, 'Laundry status updated successfully', { item });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

const markAsWorn = async (req, res, next) => {
  try {
    const item = await wardrobeService.markItemAsWorn(req.user.userId, req.params.id);
    return successResponse(res, 'Wardrobe item marked as worn', { item });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, error.status);
    next(error);
  }
};

module.exports = {
  createItem, getItems, getItem, updateItem, deleteItem,
  updateAvailability, updateLaundryStatus, markAsWorn
};
