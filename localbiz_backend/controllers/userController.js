const User = require("../model/user");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utilities/jwtToken");
const sendSecurityCode = require("../utilities/sendSecurityCode");
const generateOTP = require("../utilities/generateOTP");

const userController = {
  getUserCount: catchAsyncErrors(async (req, res) => {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  }),

  createUser: catchAsyncErrors(async (req, res) => {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  }),

  loginUser: catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ success: false, message: "Incorrect Email or Password" });
    }

    sendToken(user, 201, res);
  }),

  getAllUsers: catchAsyncErrors(async (req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  }),

  getUserById: catchAsyncErrors(async (req, res) => {
    const users = await User.findById(req.params.userId);
    res.status(200).json({ success: true, data: users });
  }),

  updateUser: catchAsyncErrors(async (req, res) => {
    const userEmail = req.params.email;
    const { name, password } = req.body;

    try {
      let user = await User.findOne({ email: userEmail });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Update user fields if provided
      if (name) user.name = name;
      if (password) user.password = password;

      await user.save();

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }),

  forgotPassword: catchAsyncErrors(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate security code
    const securityCode = generateOTP();

    // Save security code and set expiration time to 30 minutes
    user.securityCode = securityCode;
    user.securityCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.save();

    // Send security code email
    await sendSecurityCode(user.email, securityCode);

    res.status(200).json({
      success: true,
      message: "Security code sent to your email",
    });
  }),

  verifyOTPAndResetPassword: catchAsyncErrors(async (req, res) => {
    const { email, securityCode, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the security code is correct and not expired
    if (
      user.securityCode.trim() !== securityCode.trim() ||
      user.securityCodeExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired security code",
      });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Return a success response
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  }),

  resendSecurityCode: catchAsyncErrors(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the previous security code is still valid
    if (user.securityCode && user.securityCodeExpires > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Security code still valid. Please use the existing code.",
      });
    }

    // Generate a new security code
    const newSecurityCode = generateOTP();

    // Save the new security code and expiration time in the user document
    user.securityCode = newSecurityCode;
    user.securityCodeExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Resend the new security code
    await sendSecurityCode(user.email, newSecurityCode);

    res.status(200).json({
      success: true,
      message: "New security code sent to your email",
    });
  }),

  deleteUser: catchAsyncErrors(async (req, res) => {
    const userEmail = req.params.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  }),
};

module.exports = userController;
