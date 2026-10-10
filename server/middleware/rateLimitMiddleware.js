const rateLimit = {};

const rateLimitMiddleware = (limit = 10, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, resetAt: now + windowMs };
    } else {
      if (now > rateLimit[ip].resetAt) {
        rateLimit[ip] = { count: 1, resetAt: now + windowMs };
      } else {
        rateLimit[ip].count += 1;
        if (rateLimit[ip].count > limit) {
          return res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.'
          });
        }
      }
    }
    next();
  };
};

module.exports = rateLimitMiddleware;
