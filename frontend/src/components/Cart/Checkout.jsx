import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {cart ,loading,error} = useSelector((state) => state.cart);
  const {user}=useSelector((state)=> state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [isCheckoutCompleted, setIsCheckoutCompleted] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Ensure cart is loaded and user is authenticated before allowing checkout
  useEffect(()=>{
    if (isCheckoutCompleted) return;

    if(!loading && (!cart || cart.products.length === 0)){
      navigate("/collections/all");
    }
  },[cart, loading, navigate, isCheckoutCompleted]);



  const handleCheckOut = async (e) => {
    e.preventDefault();
    if(cart && cart.products.length > 0){
      const result = await dispatch(createCheckout({
        checkoutItems:cart.products,
        shippingAddress,
        paymentMethod:"razorpay",
        totalPrice:cart.totalPrice,
      }));

      if(createCheckout.fulfilled.match(result) && result.payload?._id){
        setCheckoutId(result.payload._id); // set checkout id if checkout was successful
        setCheckoutData(result.payload);
      }

    } else {
      navigate("/collections/all");
    }
  };
  const handlePaymentSuccess = async (details) => {
    try {
      if (!checkoutId) return;

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, {
        paymentStatus: "paid",
        paymentDetails: details,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if(response.status === 200){
        await handleFinalizeCheckout(checkoutId);
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
    }
    
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, { }, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if(response.status === 200){
        setIsCheckoutCompleted(true);
        toast.success("Payment successful! Your order has been placed.");
        dispatch(clearCart());
        navigate("/order-confirmation", { state: { checkout: checkoutData } });
      }
    } catch (error) {
      console.error("Checkout finalization failed:", error);
    }
  };

  if(loading ) return <p>Loading cart ...</p>
  if(error) return <p className="text-red-600">Error loading cart: {error}</p>
  if(!cart || cart.products.length === 0) return <p>Your cart is empty. Please add items to cart before checkout.</p>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCheckOut}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className=" w-full bg-TrendDrift-red text-white px-4 py-3 rounded cursor-pointer hover:bg-[#017a96] transition"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Razorpay</h3>
                <RazorpayButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={() => toast.error("Payment failed. Try again.")}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t border-gray-400 py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 border-b border-gray-400 py-2"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
              </div>
              <div>
                <h3 className="text-md">{product.name}</h3>
                <p className="text-gray-500">Size: {product.size}</p>
                <p className="text-gray-500">Color: {product.color}</p>
                <p className="text-gray-500">Quantity: {product.quantity}</p>
              </div>
              <div>
                <p className=" text-xl">${product.price * product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-400 pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
