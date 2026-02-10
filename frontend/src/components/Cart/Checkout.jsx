import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
const cart={
    products:[
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      price: 499,
      quantity: 2,
      img: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "M",
      color: "Blue",
      price: 499,
      quantity: 2,
      img: "https://picsum.photos/200?random=2",
    }
    ],
    totalPrice: 199,
}

const Checkout = () => {
    const navigate=useNavigate();
    const [CheckoutId,setCheckoutId]=useState(null);
    const [shippingAddress,setShippingAddress]=useState(
        {
            firstName:"",
            lastName:"",
            address:"",
            city:"",
            state:"",
            postalCode:"",
            country:"",
            phone:""
        }
    );
    const handleCheckOut=(e)=>{
        e.preventDefault();
        setCheckoutId(123);
    }
    const handlePaymentSuccess=(paymentDetails)=>{
        alert("Payment Successful! Thank you for your purchase.");
        navigate("/order-confirmation");
    }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      <div className='bg-white rounded-lg p-6'>
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        <form onSubmit={handleCheckOut}>
            <h3 className='text-lg mb-4'>
                Contact Details
            </h3>
            <div className='mb-4'>
                <label className='block text-gray-700'>Email</label>
                <input type="email" value="user@example.com" className='w-full p-2 border rounded'
                disabled />
            </div>
            <h3 className='text-lg mb-4'>
                Delivery
            </h3>
            <div className='mb-4 grid grid-cols-2 gap-4'>
                <div>
                    <label className='block text-gray-700'>First Name</label>
                    <input 
                    value={shippingAddress.firstName}
                    onChange={(e)=>setShippingAddress({
                        ...shippingAddress,
                        firstName:e.target.value,
                    })}
                    type="text" className='w-full p-2 border rounded' required/>
                </div>
                 <div>
                    <label className='block text-gray-700'>Last Name</label>
                    <input 
                    value={shippingAddress.lastName}
                    onChange={(e)=>setShippingAddress({
                        ...shippingAddress,
                        lastName:e.target.value,
                    })}
                    type="text" className='w-full p-2 border rounded' required/>
                </div>
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700'>Address</label>
                <input type="text" value={shippingAddress.address}
                onChange={(e)=>setShippingAddress({...shippingAddress ,address:e.target.value})}
                className='w-full p-2 border rounded'
                required
                />
            </div>
            <div className='mb-4 grid grid-cols-2 gap-4'>
                 <div>
                    <label className='block text-gray-700'>City</label>
                    <input 
                    value={shippingAddress.city}
                    onChange={(e)=>setShippingAddress({
                        ...shippingAddress,
                        city:e.target.value,
                    })}
                    type="text" className='w-full p-2 border rounded' required/>
                </div>
                
                <div>
                    <label className='block text-gray-700'>Postal Code</label>
                    <input 
                    value={shippingAddress.postalCode}
                    onChange={(e)=>setShippingAddress({
                        ...shippingAddress,
                        postalCode:e.target.value,
                    })}
                    type="text" className='w-full p-2 border rounded' required/>
                </div>
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700'>Country</label>
                <input type="text" value={shippingAddress.country}
                onChange={(e)=>setShippingAddress({
                    ...shippingAddress,
                    country:e.target.value,
                })}
                className='w-full p-2 border rounded'
                required
                />
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700'>Phone</label>
                <input type="text" value={shippingAddress.phone}
                onChange={(e)=>setShippingAddress({
                    ...shippingAddress,
                    phone:e.target.value,
                })}
                className='w-full p-2 border rounded'
                required
                />
            </div>
            <div className='mt-6'>
                {!CheckoutId ?(
                    <button
                    type='submit'
                     className=' w-full bg-black text-white px-4 py-3 rounded cursor-pointer hover:bg-gray-800 transition'>
                        Continue to Payment
                    </button>
                ):(
                    <div>
                        <h3 className='text-lg mb-4'>Pay with Paypal</h3>
                        <PayPalButton amount={100} onSuccess={handlePaymentSuccess} onError={(err) => alert("Payment failed. Try Again.")} />
                    </div>
                )}
            
            </div>
        </form>
      </div>
      {/* Right Section */}
      <div className='bg-gray-50 p-6 rounded-lg'>
        <h3 className='text-lg mb-4'>Order Summary</h3>
        <div className='border-t border-gray-400 py-4 mb-4'>
            {cart.products.map((product,index)=>(
                <div key={index} className='flex justify-between items-center mb-2 border-b border-gray-400 py-2'>
                    <div className='flex items-start'>
                        <img src={product.img} alt={product.name} className='w-20 h-24 object-cover mr-4'/>
                    </div>
                    <div>
                        <h3 className='text-md'>{product.name}</h3>
                        <p className='text-gray-500'>Size: {product.size}</p>
                        <p className='text-gray-500'>Color: {product.color}</p>
                        <p className='text-gray-500'>Quantity: {product.quantity}</p>
                    </div>
                    <div>
                        <p className=' text-xl'>${product.price * product.quantity}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className='flex justify-between items-center text-lg mb-4'>
            <p>Subtotal</p>
            <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className='flex justify-between items-center text-lg'>
            <p>Shipping</p>
            <p>Free</p>
        </div>
        <div className='flex justify-between items-center text-lg mt-4 border-t border-gray-400 pt-4'>
            <p>Total</p>
            <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Checkout
