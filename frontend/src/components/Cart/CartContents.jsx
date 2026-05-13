import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handling quantity changes and product removal
  const handleQuantityChange = (productId, delta, quantity, size, color) => {
    const updatedQuantity = quantity + delta;
    if (updatedQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          userId,
          guestId,
          productId,
          quantity: updatedQuantity,
          size,
          color,
        }),
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ userId, guestId, productId, size, color }));
  };


  return (
    <div>
      {cart?.products?.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between gap-3 py-4 border-b"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-medium leading-snug wrap-break-word">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 wrap-break-word">
                size: {product.size} | Color: {product.color}
              </p>
              <div className="flex items-center mt-2 gap-2">
                <button className="border rounded px-2 py-1 text-lg sm:text-xl font-medium cursor-pointer"
                onClick={() =>
                  handleQuantityChange(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.color,
                  )
                }
                >
                  -
                </button>
                <span className="mx-2 sm:mx-4 text-sm sm:text-base font-medium">{product.quantity}</span>
                <button className="border rounded px-2 py-1 text-lg sm:text-xl font-medium cursor-pointer"
                onClick={() =>
                  handleQuantityChange(
                    product.productId,
                    1,
                    product.quantity,
                    product.size,
                    product.color,
                  )
                }
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="shrink-0 text-right pl-1">
            <p className="font-semibold text-sm sm:text-base">${(product.price * product.quantity).toFixed(2)}</p>
            <button onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)} className="mt-2">
              <RiDeleteBin3Line className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
