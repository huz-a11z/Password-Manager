const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  
  console.log("Received cookies:", req.cookies);
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
