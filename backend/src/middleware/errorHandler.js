function errorHandler(error, req, res, _next) {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({ message });
}

module.exports = errorHandler;
