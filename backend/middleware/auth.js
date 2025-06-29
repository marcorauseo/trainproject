const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (roleList.length && !roleList.includes(payload.ruolo)) {
        return res.sendStatus(403);
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.sendStatus(401);
    }
  };
};
