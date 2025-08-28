const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();

const SECRET = process.env.SECRET_KEY;
if (!SECRET) {
  throw new Error("SECRET_KEY is not defined in .env file");
}

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found or invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Malformed token" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { auth, authorizeRole };
