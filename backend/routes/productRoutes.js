const express=require('express');
const Product=require('../models/product');
const {auth} = require("../middleware/authMiddleware");
const {adminAuth}=require('../middleware/authMiddleware');

const router=express.Router();

// Create a new product /api/products => Protected route, requires authentication
//Only admin
router.post('/',auth,adminAuth,async(req,res)=>{
    try{
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
            sku
        }=req.body;
        const newProduct=new Product({
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
            user:req.user.userId // Refernece to the admin user who created the product
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch(err){
        console.error("Product creation failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});


// edit product /api/products/:id => Protected route, requires authentication 
//Only admin
router.put('/:id',auth,adminAuth,async(req,res)=>{
    try{
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
            weight
        }=req.body;

        const product=await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        product.name=name || product.name;
        product.description=description || product.description;
        product.price=price || product.price;
        product.discountPrice=discountPrice || product.discountPrice;
        product.countInStock=countInStock || product.countInStock;
        product.category=category || product.category;
        product.brand=brand || product.brand;
        product.sizes=sizes || product.sizes;
        product.colors=colors || product.colors;
        product.collections=collections || product.collections;
        product.material=material || product.material;
        product.gender=gender || product.gender;
        product.images=images || product.images;
        product.isFeatured=isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isPublished=isPublished !== undefined ? isPublished : product.isPublished;
        product.tags=tags || product.tags;
        product.dimensions=dimensions || product.dimensions;
        product.weight=weight || product.weight;
        await product.save();
        res.json(product);
    }
    catch(err){
        console.error("Product update failed:", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
});


// delete product /api/products/:id => Protected route, requires authentication
//Only admin
router.delete('/:id',auth,adminAuth,async(req,res)=>{
    try{

        const product =await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        await product.deleteOne();
        res.json({message:"Product deleted successfully"});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
});

module.exports=router;