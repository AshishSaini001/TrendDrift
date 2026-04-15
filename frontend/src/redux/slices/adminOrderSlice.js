import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

//Async thunk to fetch all orders for admin
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                headers: {
                    Authorization: USER_TOKEN
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/orders/${id}`, { status }, {
                headers: {
                    Authorization: USER_TOKEN
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Delete order
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/orders/${id}`, {
                headers: {
                    Authorization: USER_TOKEN
                }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminOrderSlice = createSlice({
    name:"adminOrders",
    initialState:{
        loading:false,
        error:null,
        orders:[], 
        totalOrders:0,
        totalSales:0, 
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload;
            state.totalOrders=action.payload.length;
            state.totalSales=action.payload.reduce((total, order) => total + order.totalPrice, 0);
        });
        builder.addCase(fetchAllOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        });
        builder.addCase(updateOrderStatus.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const index = state.orders.findIndex(order => order._id === action.payload._id);
            if(index !== -1){
                state.orders[index] = action.payload;
            }
        });
        builder.addCase(updateOrderStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        });
        builder.addCase(deleteOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(deleteOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders = state.orders.filter(order => order._id !== action.payload);
        });
        builder.addCase(deleteOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        });
    },
});

export default adminOrderSlice.reducer;