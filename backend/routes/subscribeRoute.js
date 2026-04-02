const express=require("express");
const router=express.Router();
const subscriber = require("../models/Subscriber");

// @route   POST /api/subscribe
// @desc    Subscribe to newsletter
// @access  Public

router.post('/',async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }
    try{
        if(await subscriber.findOne({email})){
            return res.status(400).json({message:"Email already subscribed"});
        }
        const newSubscriber=new subscriber({
            email:email
        });
        await newSubscriber.save();
        res.status(201).json({message:"Subscribed successfully"});
    }catch(error){
        console.error("Error subscribing:",error);
        res.status(500).json({message:"Server error"});
    }
})
module.exports=router;