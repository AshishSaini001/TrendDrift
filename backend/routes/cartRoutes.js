const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const cart = require("../models/cart");
const { route } = require("./userRoutes");

const router = express.Router();

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add item to cart for guest or authenticated user
// @access  Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //Determine if the user is authenticated or a guest
    let cart = await getCart(userId, guestId);
    //if cart already exists
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId.toString() &&
          p.size === size &&
          p.color === color,
      );
      if (productIndex > -1) {
        //product already exists
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      //Recalculate total Price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      //create a new cart from the guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: userId
          ? undefined
          : guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (err) {
    console.log("Error adding to cart:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

//@route PUT /api/cart
//@desc Update cart item quantity or remove item
//@access Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId.toString() &&
        p.size === size &&
        p.color === color,
    );
    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
      //Recalculate total Price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    console.log("Error updating cart:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/cart
// @desc Get cart for guest or authenticated user
// @access Public

router.get("/", async (req, res) => {
  const { guestId, userId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Cart is Empty" });
    }
  } catch (err) {
    console.log("Error fetching cart:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/cart
// @desc remove a product for guest or authenticated user
// @access Public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (cart) {
      cart.products = cart.products.filter(
        (p) =>
          !(
            p.productId.toString() === productId.toString() &&
            p.size === size &&
            p.color === color
          ),
      );
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json({ message: "Product removed from cart" });
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.log("Error clearing cart:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
