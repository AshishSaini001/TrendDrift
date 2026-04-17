const express = require("express");
const Product = require("../models/product");
const { auth } = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");



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
      query.sizes = { $in: size.split(",") };
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
      const normalizedSearch = search.trim();
      const compactSearch = normalizedSearch.replace(/[^a-zA-Z0-9]/g, "");
      const exactRegex = new RegExp(escapeRegExp(normalizedSearch), "i");
      const flexibleRegex = compactSearch
        ? new RegExp(
            compactSearch
              .split("")
              .map((char) => escapeRegExp(char))
              .join("[\\W_]*"),
            "i",
          )
        : null;
      const searchableFields = ["name", "description", "brand", "category"];

      query.$or = searchableFields.flatMap((field) => {
        const rules = [{ [field]: { $regex: exactRegex } }];
        if (flexibleRegex) {
          rules.push({ [field]: { $regex: flexibleRegex } });
        }
        return rules;
      });
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



//get similar products based on category and brand /api/products/similar/:id => Public route
// based on current product category and gender

router.get(["/similar/:id", "/similiar/:id"], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product
      .find({
        _id: { $ne: product._id }, // $ne -> not equal to
        category: product.category,
        gender: product.gender,
      })
      .limit(4);
    res.json(similarProducts);
  } catch (err) {
    console.error("Get similar products failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
