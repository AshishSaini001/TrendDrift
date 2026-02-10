import React from 'react'

const checkOut={
    _id:"12323",
    createdAt:new Date(),
    checkoutItems:[
        {
            productId:"1",
            name:"T-shirt",
            size:"M",
            color:"Red",
            price:499,
            quantity:2,
            img:"https://picsum.photos/200?random=1",
        },
        {
            productId:"2",
            name:"Jeans",
            size:"M",
            color:"Blue",
            price:200,
            quantity:2,
            img:"https://picsum.photos/200?random=2",
        }
    ],
    shippingAddress:{
        address:"123 Main St",
        city:"New York",
        state:"NY",
        country:"USA"
    }
}

const calculateEstimateDelivery=(createdAt)=>{
    const orderDate=new Date(createdAt);
    const estimatedDeliveryDate=new Date(orderDate.getTime() + 7*24*60*60*1000);
    return estimatedDeliveryDate.toLocaleDateString();
}

const OrderConfirmationPage = () => {
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center  text-emerald-700 mb-8'>
        Thank you for your order!
      </h1>
      {checkOut && (
        <div className=' p-6 rounded-lg border'>
            <div className='flex justify-between mb-20'>
                {/* Order Id and Date */}
                <div>
                    <h2 className='text-xl font-semibold'>
                        Order ID: {checkOut._id}
                    </h2>
                    <p className='text-gray-500'>
                        Order date:{new Date(checkOut.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {/* Estimated DElivery */}
                <div>
                   <p className='text-emerald-700 text-sm'>
                    Estimated Delivery:{" "}{calculateEstimateDelivery(checkOut.createdAt)}
                    </p> 
                </div>
            </div>
            {/* Order Items */}
            <div className='mb-20'>
                {checkOut.checkoutItems.map((items)=>(
                    <div key={items.productId} className='flex items-center mb-4'>
                        <img src={items.img} alt={items.name} className='w-15 h-16 object-cover rounded-md mr-4' />
                        <div>
                            <h4 className='text-md font-semibold'>{items.name}</h4>
                            <p className='text-sm text-gray-500'>{items.color}|{items.size}</p>
                        </div>
                        <div className='ml-auto text-right'>
                            <p className="text-md">${items.price}</p>
                            <p className='text-sm text-gray-500'>Qty: {items.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* PAyment and Delivery Info */}
             <div className='grid grid-cols-2 gap-8'> {/*payment Info */}
                <div>
                    <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                    <p className='text-gray-600'>PayPal</p>
                </div>
                <div>
                    <h4 className='text-lg font-semibold mb-2'>Shipping Address</h4>
                    <p className='text-gray-600'>{checkOut.shippingAddress.address}</p>
                    <p className='text-gray-600'>{checkOut.shippingAddress.city}, {checkOut.shippingAddress.country}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default OrderConfirmationPage
