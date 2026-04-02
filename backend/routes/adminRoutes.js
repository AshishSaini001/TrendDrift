const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { route } = require("./userRoutes");

// @route   GET /api/admin/users
// @desc    Get all users - Admin only
// @access  Private/Admin
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetching users failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user - Admin only
// @access  Private/Admin
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Deleting user failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user Info - Admin only
// @access  Private/Admin
router.put("/:id", auth, adminAuth, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.email = email;
    if (password) {
      user.password = password;
    }
    if (role && !["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    user.role = role || user.role;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Updating user failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//@route POST /api/admin/users
//@desc Create a new user - Admin only
//@access Private/Admin
router.post("/", auth, adminAuth, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }
  if (role && !["customer", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const newUser = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Creating user failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
