const express=require("express");
const Checkout=require("../models/Checkout");
const Order=require("../models/Order");
const Cart=require("../models/cart");
const Product=require("../models/product");
const {auth} = require("../middleware/authMiddleware");

const router=express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/",auth,async(req,res)=>{
    try{
        const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body;
        if(!checkoutItems || checkoutItems.length===0){
            return res.status(400).json({message:"No items to checkout"});
        }
        // Create a new checkout session
        const newCheckout=await Checkout.create({
            user:req.user.userId,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"pending",
            isPaid:false,
        });
        console.log("Checkout session created");
        
        res.status(201).json(newCheckout);

    }catch(error){
        console.error("Error creating checkout session:",error);
        res.status(500).json({message:"Server error"});
    }
});


//@route PUT /api/checkout/:id/pay
//@desc Update checkout session to paid
//@access Private

router.put("/:id/pay",auth,async(req,res)=>{
    const {paymentStatus,paymentDetails}=req.body;
    try{
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout session not found"});
        }
        if(paymentStatus==="paid"){
            checkout.paymentStatus="paid";
            checkout.isPaid=true;
            checkout.paidAt=Date.now();
            checkout.paymentDetails=paymentDetails;
            await checkout.save();
        res.json({message:"Checkout session updated successfully", checkout});
        }
        else{
            return res.status(400).json({message:"Invalid payment status"});
        }     
    }
    catch(error){
        console.error("Error updating checkout session:",error);
        res.status(500).json({message:"Server error"});
    }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize the order after successful payment and create an order record
//@access Private

router.post("/:id/finalize",auth,async(req,res)=>{
    try{
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout session not found"});
        }
        if(checkout.isPaid && !checkout.isFinalized){
            
            // Create a new order record
            const newOrder=await Order.create({
                user:checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:checkout.isPaid,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:checkout.paymentStatus,
                paymentDetails:checkout.paymentDetails,
            })
            // Mark the checkout session as finalized
            checkout.isFinalized=true;
            checkout.finalizedAt=Date.now();
            await checkout.save({ validateBeforeSave: false });
            // Clear the user's cart
            await Cart.findOneAndDelete({user:checkout.user});
            // Update product stock 
             for(const item of checkout.checkoutItems){
                const product=await Product.findById(item.productId);
                if(product){
                    product.stock=product.stock-(item.quantity || 1);
                    await product.save();
                }}
            res.status(200).json({message:"Order finalized successfully", order:newOrder});
        }
        else if(checkout.isFinalized){
            return res.status(400).json({message:"Checkout session is already finalized"});
        }
        else{
            return res.status(400).json({message:"Payment not completed, cannot finalize order"});
        }
    }
    catch(error){
        console.error("Error finalizing order:",error);
        res.status(500).json({message:"Server error"});
    }
});

module.exports=router;