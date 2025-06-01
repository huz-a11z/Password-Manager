const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "your-secret-key"; // Store this in .env in production

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
