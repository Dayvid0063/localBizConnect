// isAuthenticated.js

const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const ErrorHandler = require("../utilities/ErrorHandler");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ErrorHandler("Please login to continue", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || config.get("JWT_SECRET_KEY")
    );
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = isAuthenticated;
