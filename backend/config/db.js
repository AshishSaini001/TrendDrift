const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await connectionPromise;
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    connectionPromise = undefined;
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
