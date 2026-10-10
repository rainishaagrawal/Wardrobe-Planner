const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Something went wrong';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;
