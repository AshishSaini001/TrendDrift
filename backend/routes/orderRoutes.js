const express=require('express');
const {auth,adminAuth}=require("../middleware/authMiddleware");
const Order=require("../models/Order");

const router=express.Router();


// @route GET /api/orders/myorders
// @desc Get logged in user's orders
// @access Private
router.get("/my-orders",auth,async(req,res)=>{
    try{
        const orders=await Order.find({user:req.user.userId}).sort({
            createdAt:-1
        });
        res.json(orders);
    }
    catch(error){
        console.error("Error fetching user orders:",error);
        res.status(500).json({message:"Server error"});
    }
});


// @route GET /api/orders/:id
// @desc Get full order details by ID
// @access Private
router.get("/:id",auth,async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id).populate("user","name email");
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        // Ensure the logged in user is the owner of the order
        if(order.user._id.toString()!==req.user.userId){
            return res.status(403).json({message:"Not authorized to view this order"});
        }
        res.json(order);
    }
    catch(error){
        console.error("Error fetching order details:",error);
        res.status(500).json({message:"Server error"});
    }
})

// @route GET /api/orders
// @desc Get all orders (admin only)
// @access Private/Admin

router.get("/",auth,adminAuth,async(req,res)=>{
    try{
        const orders=await Order.find().populate("user","name email").sort({createdAt:-1});
        res.json(orders);
    }
    catch(error){
        console.error("Error fetching all orders:",error);
        res.status(500).json({message:"Server error"});
    }
});

// @route PUT /api/orders/:id/deliver
// @desc Update order to delivered
// @access Private/Admin
router.put("/:id/deliver",auth,adminAuth,async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        order.isDelivered=true;
        order.deliveredAt=Date.now();
        await order.save();
        res.json({message:"Order marked as delivered", order});
    }
    catch(error){
        console.error("Error marking order as delivered:",error);
        res.status(500).json({message:"Server error"});
    }
});

module.exports=router;