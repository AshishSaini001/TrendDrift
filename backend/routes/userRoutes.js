const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {auth} = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkExisting = await User.findOne({ email });
    if (checkExisting) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          token: token,
        });
      },
    );
  } catch (err) {
    console.error("User registration failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login user /api/users/login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: token,
        });
      },
    );
  } catch (err) {
    console.error("User login failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user profile /api/users/profile => Protected route, requires authentication
router.get("/profile", auth ,async(req,res)=>{
    try{
        const user = await User.findById(req.user.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }
    catch(err){
        console.error("Fetching user profile failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});

//Update user profile /api/users/profile => Protected route, requires authentication
router.put("/profile", auth ,async(req,res)=>{
    const { name, email, password } = req.body;
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    catch(err){
        console.error("Updating user profile failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});

//change password /api/users/change-password => Protected route, requires authentication
router.put("/change-password", auth ,async(req,res)=>{
    const { currentPassword, newPassword } = req.body;
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch = await user.matchPassword(currentPassword);
        if(!isMatch){
            return res.status(400).json({message:"Current password is incorrect"});
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({message:"Password changed successfully"});
    }
    catch(err){
        console.error("Changing password failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});

// change role /api/users/change-role => Protected route, requires authentication and admin role
router.put("/change-role", auth ,async(req,res)=>{
    const { userId, newRole } = req.body;
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({message:"Access denied, admin only"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.role = newRole;
        await user.save();
        res.status(200).json({message:"User role updated successfully"});
    }
    catch(err){
        console.error("Changing user role failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});

// Delete user /api/users/delete => Protected route, requires authentication and admin role
router.delete("/delete", auth ,async(req,res)=>{
    const { userId } = req.body;
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({message:"Access denied, admin only"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        await user.remove();
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(err){
        console.error("Deleting user failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});


module.exports = router;
