import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';
import { useNavigate } from 'react-router-dom';
const OrderManagement = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const {user}=useSelector((state)=>state.auth);
 const {orders,totalOrders,totalSales,loading,error}=useSelector((state)=>state.adminOrders);

  useEffect(()=>{
    if(!user || user.role?.toLowerCase() !== "admin"){
      navigate("/");
      return;
    }
    dispatch(fetchAllOrders());
  },[user,navigate,dispatch])
  const handleStatusChange=(orderId,status)=>{
    // Implement status change logic here
    dispatch(updateOrderStatus({id:orderId,status}))
  }
  if(loading){
    return <p>Loading...</p>
  }
  if(error){
    return <p className='text-red-500'>Error fetching orders: {error}</p>
  }
  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className="2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ?(
              orders.map((order)=>(
                <tr key={order._id} className="border-b bg-white">
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">#{order._id}</td>
                  <td className="py-4 px-4">{order.user?.name || "Unknown User"}</td>
                  <td className="py-4 px-4">${Number(order.totalPrice || 0).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <select value={order.status} onChange={(e)=>handleStatusChange(order._id,e.target.value)}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 cursor-pointer'
                      >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      </select>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                    onClick={()=>handleStatusChange(order._id,"delivered")}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
                
              ))
            ):(
              <tr className="border-b bg-white">
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderManagement
