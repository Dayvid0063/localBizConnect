const User = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utilities/jwtToken");
const sendActivationEmail = require("../utilities/sendActivationEmail");

const adminController = {
  createAdmin: catchAsyncErrors(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const existingAdmin = await User.findOne({ email, role: "admin" });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    const activationToken = createActivationToken(admin);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendActivationEmail(admin.email, activationUrl);
      return res.status(201).json({
        success: true,
        message: `Please check your email:- ${admin.email} to activate your account`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }),

  activateAdmin: catchAsyncErrors(async (req, res) => {
    const { activationToken } = req.params;

    try {
      const decoded = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET || config.get("ACTIVATION_SECRET")
      );

      const { id, name, email, role } = decoded;

      let admin = await User.findById(id);

      if (!admin) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      if (admin.role !== "admin") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user role" });
      }

      if (admin.isActivated) {
        return res
          .status(400)
          .json({ success: false, message: "Account already activated" });
      }

      admin.isActivated = true;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Account activated successfully",
      });
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" &&
        error.message === "jwt expired"
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Activation token expired" });
      } else {
        throw error;
      }
    }
  }),

  loginAdmin: catchAsyncErrors(async (req, res) => {
    // Controller logic for logging in admin
  }),

  getAdmin: catchAsyncErrors(async (req, res) => {
    // Controller logic for getting admin details
  }),

  logoutAdmin: catchAsyncErrors(async (req, res) => {
    // Controller logic for logging out admin
  }),
};

const createActivationToken = (admin) => {
  const payload = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
  return jwt.sign(
    payload,
    process.env.ACTIVATION_SECRET || config.get("ACTIVATION_SECRET"),
    {
      expiresIn: "5m",
    }
  );
};

module.exports = adminController;
