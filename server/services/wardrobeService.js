const WardrobeItem = require('../models/WardrobeItem');

const createWardrobeItem = async (userId, data) => {
  const item = await WardrobeItem.create({
    ...data,
    user: userId,
    availability: 'available',
    laundryStatus: 'clean',
    wearCount: 0,
    lastWornAt: null
  });
  return item;
};

const getWardrobeItems = async (userId, queryParams) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    color,
    availability,
    laundryStatus,
    formality,
    fit,
    pattern,
    material,
    aesthetic
  } = queryParams;

  const filter = { user: userId };

  if (category) filter.category = category;
  if (color) filter.primaryColor = color; 
  if (availability) filter.availability = availability;
  if (laundryStatus) filter.laundryStatus = laundryStatus;
  if (formality) filter.formality = formality;
  if (fit) filter.fit = fit;
  if (pattern) filter.pattern = pattern;
  if (material) filter.material = material;
  if (aesthetic) filter.aesthetics = aesthetic;

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { name: regex },
      { brand: regex },
      { subcategory: regex }
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = Math.min(parseInt(limit, 10), 50);
  const skip = (pageNum - 1) * limitNum;

  const items = await WardrobeItem.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const count = await WardrobeItem.countDocuments(filter);

  return {
    items,
    count,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems: count,
      totalPages: Math.ceil(count / limitNum)
    }
  };
};

const getWardrobeItem = async (userId, itemId) => {
  const item = await WardrobeItem.findOne({ _id: itemId, user: userId });
  if (!item) {
    const error = new Error('Wardrobe item not found');
    error.status = 404;
    throw error;
  }
  return item;
};

const updateWardrobeItem = async (userId, itemId, updateData) => {
  const forbiddenFields = ['user', '_id', 'createdAt'];
  const sanitizedUpdate = { ...updateData };
  forbiddenFields.forEach((field) => delete sanitizedUpdate[field]);

  const item = await WardrobeItem.findOneAndUpdate(
    { _id: itemId, user: userId },
    { $set: sanitizedUpdate },
    { new: true }
  );

  if (!item) {
    const error = new Error('Wardrobe item not found');
    error.status = 404;
    throw error;
  }
  return item;
};

const deleteWardrobeItem = async (userId, itemId) => {
  const item = await WardrobeItem.findOneAndDelete({ _id: itemId, user: userId });
  if (!item) {
    const error = new Error('Wardrobe item not found');
    error.status = 404;
    throw error;
  }
  return true;
};

const updateAvailability = async (userId, itemId, availability) => {
  return await updateWardrobeItem(userId, itemId, { availability });
};

const updateLaundryStatus = async (userId, itemId, laundryStatus) => {
  return await updateWardrobeItem(userId, itemId, { laundryStatus });
};

const markItemAsWorn = async (userId, itemId) => {
  const item = await WardrobeItem.findOneAndUpdate(
    { _id: itemId, user: userId },
    {
      $inc: { wearCount: 1, 'recommendationStats.timesSelected': 1 },
      $set: { lastWornAt: new Date() }
    },
    { new: true }
  );

  if (!item) {
    const error = new Error('Wardrobe item not found');
    error.status = 404;
    throw error;
  }
  return item;
};

module.exports = {
  createWardrobeItem,
  getWardrobeItems,
  getWardrobeItem,
  updateWardrobeItem,
  deleteWardrobeItem,
  updateAvailability,
  updateLaundryStatus,
  markItemAsWorn
};
