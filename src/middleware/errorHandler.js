export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  const status = error.statusCode || (error.code === 11000 ? 409 : ['ValidationError', 'ZodError', 'CastError', 'MulterError'].includes(error.name) ? 400 : 500);
  const validationMessage = error.name === 'ZodError' ? error.issues.map((issue) => issue.message).join('. ') : null;
  const duplicateMessage = error.code === 11000 ? 'A product with this unique value already exists.' : null;
  if (process.env.NODE_ENV !== 'production') console.error(error);
  res.status(status).json({
    message: status === 500 ? 'Unexpected server error' : validationMessage || duplicateMessage || error.message,
    ...(process.env.NODE_ENV !== 'production' && status === 500 ? { stack: error.stack } : {})
  });
}
