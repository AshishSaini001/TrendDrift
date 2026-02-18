const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/product");
const User = require("./models/User");
const products = require("./data/product");
const Cart = require("./models/cart");

// connect to MongoDB

mongoose.connect(process.env.MONGO_URI);

// function to seed data

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    //default admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    //Assigning default admin user to the products
    const userID = adminUser._id;

    // Create sample products
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // Insert sample products into the database
    await Product.insertMany(sampleProducts);

    console.log("Data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Data seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();
