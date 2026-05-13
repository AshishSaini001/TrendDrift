const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const router = express.Router();

// Register a new user /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // Update user's OTP and password if unverified
        user.name = name;
        user.password = password;
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
      }
    } else {
      user = new User({ name, email, password, otp, otpExpires, isVerified: false });
      await user.save();
    }

    // Send email
    const message = `Your TrendDrift Verification Code is: ${otp}. It is valid for 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: "Your TrendDrift Verification Code",
      message,
    });

    res.status(200).json({ message: "OTP sent to email", userId: user._id, email: user.email });
  } catch (err) {
    console.error("User registration failed:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message, stack: err.stack });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("OTP verification failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your New TrendDrift Verification Code",
      message: `Your new TrendDrift Verification Code is: ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP failed:", err.message);
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

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first", email: user.email, unverified: true });
    }

    if(!user.password) {
        return res.status(400).json({ message: "Invalid credentials. Did you sign up with Google?" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("User login failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Google Auth
router.post("/google-auth", async (req, res) => {
  const { token } = req.body;
  try {
    // The frontend useGoogleLogin hook returns an access_token (starts with ya29.)
    // We use it to fetch the user's profile from Google's userinfo endpoint.
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || "Failed to fetch user info from Google");
    }
    
    const { name, email, sub: googleId } = data;

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = new User({ name, email, googleId, isVerified: true });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: jwtToken,
    });
  } catch (err) {
    console.error("Google Auth failed:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
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




module.exports = router;
