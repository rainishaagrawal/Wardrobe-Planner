const { verifyToken } = require('../utils/jwtUtils');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    req.user = { userId: user._id };
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication required', 401);
  }
};

module.exports = authMiddleware;
