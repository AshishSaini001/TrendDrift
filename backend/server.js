require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutROutes");

app.use(cors());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME TO TRENDRIFT BACKEND");
});

// User routes
app.use("/api/users", userRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);

// Checkout routes
app.use("/api/checkout", checkoutRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
