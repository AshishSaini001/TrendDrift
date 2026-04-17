import React from "react";
import { useState, useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {orders ,loading,error}=useSelector((state)=> state.orders);
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-10">Loading your orders...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }



  const handleRowClick = (orderId) => {
    // Navigate to order details page
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rouded-lg overflow-hidden">
        <table className="min-w-full  text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-2">
                Image
              </th>
              <th scope="col" className="px-4 py-2">
                Order Id
              </th>
              <th scope="col" className="px-4 py-2 ">
                Created
              </th>
              <th scope="col" className="px-4 py-2">
                Shipping Address
              </th>
              <th scope="col" className="px-4 py-2">
                Items
              </th>
              <th scope="col" className="px-4 py-2">
                Price
              </th>
              <th scope="col" className="px-4 py-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:border-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                    {order.shippingAddress.city},{order.shippingAddress.country}
                  </td>
                  <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                    {order.orderItems.length}
                  </td>

                  <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                    ${order.totalPrice}
                  </td>
                  <td className="py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                    <span
                      className={`${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}
                            px-2 py-1 rounded-full text-xs sm:text-sm font-medium
                            `}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  You have no orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
