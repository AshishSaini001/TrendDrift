import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import CartContents from '../Cart/CartContents';
import { useSelector } from 'react-redux';


const CartDrawer = ({drawerOpen,toggleCartDrawer}) => {
  const navigate=useNavigate();
  const {user,guestId} =useSelector((state)=> state.auth);
  const {cart} =useSelector((state)=> state.cart);
  const userId=user ? user._id : null;
  const isCartEmpty = !cart?.products?.length;

  const handleCheckout=()=>{
    if (isCartEmpty) return;
    toggleCartDrawer();
    if(!user) {
      navigate("/login?redirect=checkout");
    }
    else
      {
    navigate("/checkout");}
  }
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-40 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCartDrawer}
      ></div>

      <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 
        ${drawerOpen?'translate-x-0':'translate-x-full'}`
        
      }>
        
        {/* Close Button */}
        <div className='flex justify-end p-4'>
        <button onClick={toggleCartDrawer}>
          <IoMdClose className='h-6 w-6 text-gray-600 cursor-pointer ' />
        </button>
        </div>
        {/* Cart contenets with scrollable area */}
        <div className='grow p-4 overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
            {/* Componenet for cart componnents */}
            {cart && cart?.products?.length > 0 ? (<CartContents cart={cart} userId={userId} guestId={guestId} />):(<p>Your cart is empty.</p>)}
        </div>
        {/* Checkout Button */}
        <div className='p-4 bg-white sticky bottom-0 '>
          {cart && cart?.products?.length > 0 && (
            <p className='text-lg font-semibold mb-4 text-center'>Subtotal: ${cart.totalPrice.toFixed(2)}</p>
          )}
          <button
          disabled={isCartEmpty}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isCartEmpty
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-TrendDrift-red text-white hover:bg-[#017a96] cursor-pointer'
          }`}
          onClick={handleCheckout}
          >Checkout</button>
          <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>
            Shipping, taxes, and discounts calculated at checkout.
          </p>
        </div>
      </div>
    </>
  )
}

export default CartDrawer
