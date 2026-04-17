import React from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const calculateEstimateDelivery = (createdAt) => {
  const orderDate = createdAt ? new Date(createdAt) : new Date();
  const estimatedDeliveryDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  return estimatedDeliveryDate.toLocaleDateString();
};

const OrderConfirmationPage = () => {
  const location = useLocation();
  const checkoutFromRoute = location.state?.checkout;
  const checkoutFromStore = useSelector((state) => state.checkout.checkout);
  const checkout = checkoutFromRoute || checkoutFromStore;

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
        Thank you for your order!
      </h1>

      {!checkout ? (
        <div className='rounded-lg border p-6 text-center'>
          <p className='text-gray-600 mb-4'>Your order has been placed successfully.</p>
          <Link
            to='/my-orders'
            className='inline-flex items-center rounded-lg bg-TrendDrift-red px-5 py-3 text-white font-semibold hover:bg-[#017a96] transition'
          >
            View Orders
          </Link>
        </div>
      ) : (
        <div className='p-6 rounded-lg border'>
          <div className='flex justify-between mb-20'>
            <div>
              <h2 className='text-xl font-semibold'>
                Order ID: {checkout._id}
              </h2>
              <p className='text-gray-500'>
                Order date: {new Date(checkout.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className='text-emerald-700 text-sm'>
                Estimated Delivery: {calculateEstimateDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          <div className='mb-20'>
            {checkout.checkoutItems?.map((item) => (
              <div key={item.productId} className='flex items-center mb-4'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-15 h-16 object-cover rounded-md mr-4'
                />
                <div>
                  <h4 className='text-md font-semibold'>{item.name}</h4>
                  <p className='text-sm text-gray-500'>{item.color} | {item.size}</p>
                </div>
                <div className='ml-auto text-right'>
                  <p className='text-md'>${item.price}</p>
                  <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Payment</h4>
              <p className='text-gray-600'>{checkout.paymentMethod || 'Razorpay'}</p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Shipping Address</h4>
              <p className='text-gray-600'>{checkout.shippingAddress?.address}</p>
              <p className='text-gray-600'>
                {checkout.shippingAddress?.city}, {checkout.shippingAddress?.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage
