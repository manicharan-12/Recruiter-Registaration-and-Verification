// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mani');
    req.recruiterId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};