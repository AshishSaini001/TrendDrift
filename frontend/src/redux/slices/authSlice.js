import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//Retrieve user from local storage
const userFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

//check for existing guest ID in the local storage or generate a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`;
localStorage.setItem('guestId', initialGuestId);

//Initial state
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

//Async thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser', async (userData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('userToken', response.data.token);
            return response.data.user; //Return user data to be stored in the state
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Login failed' });
        }
    }
);

//Async thunk for user registration
export const registerUser = createAsyncThunk(
    'auth/registerUser', async (userData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
            // Don't save user to storage yet, Registration now requires OTP
            return response.data; // Includes message and email
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Registration failed' });
        }
    }
);

//Async thunk for OTP verification
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp', async (otpData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`, otpData);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('userToken', response.data.token);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'OTP verification failed' });
        }
    }
);

//Async thunk for Resending OTP
export const resendOtp = createAsyncThunk(
    'auth/resendOtp', async (emailData, {rejectWithValue}) => {
        try {
             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/resend-otp`, emailData);
             return response.data;
        } catch (error) {
             return rejectWithValue(error.response?.data || { message: 'Resend OTP failed' });
        }
    }
);

//Async thunk for Google Auth
export const googleAuth = createAsyncThunk(
    'auth/googleAuth', async (tokenData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google-auth`, tokenData);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('userToken', response.data.token);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Google Auth failed' });
        }
    }
);

//Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${Date.now()}`; //Generate a new guest ID on logout
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userToken');
            localStorage.setItem('guestId', state.guestId); //Store the new guest ID in local storage
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${Date.now()}`;
            localStorage.setItem('guestId', state.guestId); //Store the new guest ID in local storage
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Login failed';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                // Wait for OTP, so user state isn't populated here
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Registration failed';
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'OTP Verification failed';
            })
            .addCase(googleAuth.pending, (state) => {
                 state.loading = true;
                 state.error = null;
            })
            .addCase(googleAuth.fulfilled, (state, action) => {
                 state.loading = false;
                 state.user = action.payload;
            })
            .addCase(googleAuth.rejected, (state, action) => {
                 state.loading = false;
                 state.error = action.payload?.message || action.error?.message || 'Google Auth failed';
            });
    },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;