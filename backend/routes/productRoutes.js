const express = require("express");
const Product = require("../models/product");
const { auth } = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new product /api/products => Protected route, requires authentication
//Only admin
router.post("/", auth, adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user.userId, // Refernece to the admin user who created the product
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Product creation failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// edit product /api/products/:id => Protected route, requires authentication
//Only admin
router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.countInStock = countInStock || product.countInStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.collections = collections || product.collections;
    product.material = material || product.material;
    product.gender = gender || product.gender;
    product.images = images || product.images;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished =
      isPublished !== undefined ? isPublished : product.isPublished;
    product.tags = tags || product.tags;
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Product update failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete product /api/products/:id => Protected route, requires authentication
//Only admin
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get all products /api/products => Public route
// get all products with pagination, filtering and sorting
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {};
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }
    if (size) {
      query.size = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender && gender.toLocaleLowerCase() !== "all") {
      query.gender = gender;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }
    if (search) {
      query.$or = [
        // $or -> return document that matches at least of the specified conditions in the array
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    //Sorting
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }
    let products = await Product.find(query)
      .sort(sort || { createdAt: -1 })
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// best selling products /api/products/best-seller => Public route
router.get("/best-seller", async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(8);
    res.json(products);
  } catch (err) {
    console.error("Get best selling products failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//get new Arrivals /api/products/new-arrivals => Public route
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (err) {
    console.error("Get new arrivals failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get single product /api/products/:id => Public route
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Get product failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



//get similiar products based on category and brand /api/products/similar/:id => Public route
// based on current product category and gender

router.get("/similiar/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similiarProducts = await product
      .find({
        _id: { $ne: product._id }, // $ne -> not equal to
        category: product.category,
        gender: product.gender,
      })
      .limit(4);
    res.json(similiarProducts);
  } catch (err) {
    console.error("Get similiar products failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
