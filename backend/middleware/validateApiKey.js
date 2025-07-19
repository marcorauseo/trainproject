module.exports = function validateApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== 'ferrovie-key') {
    return res.status(403).json({ error: 'API key non valida' });
  }
  next();
};
