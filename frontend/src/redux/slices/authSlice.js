import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
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
            return rejectWithValue(error.response.data);
        }
    }
);

//Async thunk for user registration
export const registerUser = createAsyncThunk(
    'auth/registerUser', async (userData, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('userToken', response.data.token);
            return response.data.user; //Return user data to be stored in the state
        } catch (error) {
            return rejectWithValue(error.response.data);
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
                state.error = action.payload.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const {logout, generateNewGuestId} = authSlice.actions;
export default authSlice.reducer;