const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET; // Replace with a secure secret key

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};