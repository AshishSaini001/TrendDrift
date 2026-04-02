const express = require("express");
const Order = require("../models/Order");
const { auth, adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/orders => Protected route, requires authentication
// @desc Get all orders for admin management
// Only admin
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route PUT /api/admin/orders/:id => Protected route, requires authentication
// @desc Update an existing order for admin management
// Only admin
router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route DELETE /api/admin/orders/:id => Protected route, requires authentication
// @desc Delete an existing order for admin management
// Only admin

router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
