import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch all products for admin
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchAdminProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/products`, {
                headers: {
                    Authorization: USER_TOKEN,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

// async thunk to create a new product
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/admin/products`, productData, {
                headers: {
                    Authorization: USER_TOKEN,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);
// async thunk to update a product
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
                headers: {
                    Authorization: USER_TOKEN,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/api/admin/products/${id}`, {
                headers: {
                    Authorization: USER_TOKEN,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        loading: false,
        products: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        builder.addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
        builder.addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.products.findIndex((p) => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        });
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
        builder.addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products.filter((p) => p._id !== action.payload._id);
        });
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    },
});

export default adminProductSlice.reducer;