const validateAnalyzeRequest = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, message: 'Item ID is required' });
  }
  next();
};

module.exports = { validateAnalyzeRequest };
