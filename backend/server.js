require('dotenv').config();
const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');


const app=express();
app.use(express.json());


const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');



app.use(cors());


// Connect to MongoDB
connectDB();

app.get('/',(req,res)=>{
    res.send("WELCOME TO TRENDIFT BACKEND");
});

// User routes
app.use('/api/users',userRoutes);

// Product routes
app.use('/api/products',productRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})