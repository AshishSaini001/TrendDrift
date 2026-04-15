import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Helper function to get cart from localStorage
const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

//Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

//Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: { userId, guestId },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//Add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, guestId, productId, quantity, size, color },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          userId,
          guestId,
          productId,
          quantity,
          size,
          color,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//Update cart item quantity or attributes
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { userId, guestId, cartItemId, quantity, size, color },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          userId,
          guestId,
          cartItemId,
          quantity,
          size,
          color,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, guestId, productId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          data: {
            userId,
            guestId,
            productId,
            size,
            color,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//Merge guest cart with user cart upon login
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ user, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        {
          user,
          guestId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
    reducers: {
    //Reducer to clear cart (e.g., after successful checkout)
    clearCart: (state) => {
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder      
       .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
        })
        .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        saveCartToStorage(action.payload);
        })
        .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to cart";
        })
        .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        saveCartToStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update cart item";
        })
        .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item from cart";
        })
        .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        saveCartToStorage(action.payload);
        })
        .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart"; 
        });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;