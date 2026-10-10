const Inspiration = require('../../models/Inspiration');
const { analyzeInspirationDeterministic } = require('../ai/inspirationAnalyzer');

const createInspiration = async (userId, data) => {
  const ins = new Inspiration({ ...data, user: userId });
  await ins.save();
  return ins;
};

const getInspirations = async (userId, filters) => {
  const { page = 1, limit = 20, aesthetic, color, season, tag, analyzed, search } = filters;
  const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(parseInt(limit), 50);
  
  const query = { user: userId };
  if (aesthetic) query['analysis.aesthetics'] = aesthetic;
  if (color) query['analysis.colors'] = color;
  if (season) query['analysis.season'] = season;
  if (tag) query.tags = tag;
  if (analyzed !== undefined) query['analysis.analyzed'] = analyzed === 'true';
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const inspirations = await Inspiration.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
  const total = await Inspiration.countDocuments(query);
  
  return {
    inspirations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  };
};

const getInspirationById = async (userId, id) => {
  const ins = await Inspiration.findOne({ _id: id, user: userId });
  if (!ins) throw Object.assign(new Error('Inspiration not found'), { status: 404 });
  return ins;
};

const updateInspiration = async (userId, id, data) => {
  const ins = await getInspirationById(userId, id);
  const fieldsCausingReanalysis = ['imageUrl', 'title', 'notes', 'tags', 'source', 'sourceUrl'];
  let shouldReanalyze = false;
  
  for (const field of fieldsCausingReanalysis) {
    if (data[field] !== undefined && data[field] !== ins[field]) {
      ins[field] = data[field];
      shouldReanalyze = true;
    }
  }
  
  if (shouldReanalyze) {
    ins.analysis.analyzed = false;
  }
  
  await ins.save();
  return ins;
};

const deleteInspiration = async (userId, id) => {
  const ins = await getInspirationById(userId, id);
  await ins.deleteOne();
  return ins;
};

const analyzeInspiration = async (userId, id) => {
  const ins = await getInspirationById(userId, id);
  const analysis = analyzeInspirationDeterministic(ins);
  ins.analysis = analysis;
  await ins.save();
  return ins;
};

module.exports = {
  createInspiration, getInspirations, getInspirationById, updateInspiration, deleteInspiration, analyzeInspiration
};
