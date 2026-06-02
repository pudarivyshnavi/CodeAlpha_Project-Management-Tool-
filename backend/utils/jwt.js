const jwt = require("jsonwebtoken");

// ACCESS TOKEN
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// REFRESH TOKEN
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// VERIFY TOKEN
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyAccessToken = verifyToken;
const verifyRefreshToken = verifyToken;

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyAccessToken,
  verifyRefreshToken,
};