const Feedback = require('../../models/Feedback');
const Outfit = require('../../models/Outfit');
const { extractAttributes } = require('../ai/feedbackAnalyzer');
const { applyFeedbackLearning, reverseFeedbackLearning } = require('../style/styleLearningService');

const submitOutfitFeedback = async (userId, outfitId, data) => {
  const { rating, comment, context } = data;

  const outfit = await Outfit.findOne({ _id: outfitId, user: userId }).populate('items');
  if (!outfit) throw Object.assign(new Error('Outfit not found'), { status: 404 });

  let feedback = await Feedback.findOne({ user: userId, outfit: outfitId });

  if (feedback) {
    // Reverse old learning
    await reverseFeedbackLearning(userId, feedback.learningSnapshot);
    feedback.rating = rating;
    if (comment) feedback.comment = comment;
    if (context) feedback.context = context;
  } else {
    feedback = new Feedback({
      user: userId,
      outfit: outfitId,
      rating,
      comment,
      context
    });
  }

  // Apply new learning
  const attributes = extractAttributes(outfit);
  const snapshot = await applyFeedbackLearning(userId, attributes, rating);
  
  feedback.learningSnapshot = snapshot;
  await feedback.save();

  // Update Outfit liked status
  if (rating === 'like') outfit.liked = true;
  else if (rating === 'dislike') outfit.liked = false;
  // if 'skip', we don't necessarily change liked flag
  await outfit.save();

  return feedback;
};

const getUserFeedback = async (userId, filters) => {
  const { page = 1, limit = 20, rating, type } = filters;
  const parsedLimit = Math.min(Math.max(1, parseInt(limit)), 50);
  const skip = (parseInt(page) - 1) * parsedLimit;

  const query = { user: userId };
  if (rating) query.rating = rating;
  if (type) query.type = type;

  const feedback = await Feedback.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .populate({
      path: 'outfit',
      select: 'items occasion score status',
      populate: { path: 'items', select: 'name category imageUrl' }
    });

  const total = await Feedback.countDocuments(query);

  return {
    feedback,
    pagination: {
      page: parseInt(page),
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit)
    }
  };
};

const getFeedbackById = async (feedbackId, userId) => {
  const feedback = await Feedback.findOne({ _id: feedbackId, user: userId })
    .populate({
      path: 'outfit',
      populate: { path: 'items' }
    });
  if (!feedback) throw Object.assign(new Error('Feedback not found'), { status: 404 });
  return feedback;
};

const deleteFeedback = async (feedbackId, userId) => {
  const feedback = await Feedback.findOne({ _id: feedbackId, user: userId });
  if (!feedback) throw Object.assign(new Error('Feedback not found'), { status: 404 });

  await reverseFeedbackLearning(userId, feedback.learningSnapshot);
  await feedback.deleteOne();
};

module.exports = {
  submitOutfitFeedback,
  getUserFeedback,
  getFeedbackById,
  deleteFeedback
};
