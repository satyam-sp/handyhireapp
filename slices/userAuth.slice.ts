import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosInstance';
import { RootState } from '../store';

// Async Thunk for sending OTP
export const sendOtp = createAsyncThunk(
    'userAuth/sendOtp',
    async (mobile_number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/users/send_otp`, { mobile_number });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for verifying OTP and logging in/creating user
export const verifyOtpAndLogin = createAsyncThunk(
    'userAuth/verifyOtpAndLogin',
    async ({ mobile_number, otp }: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/users/verify_otp`, { mobile_number, otp });
            return response.data; // Should contain user data and token
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const getCurrentUser = createAsyncThunk<any, void, { state: RootState }>(
    'userAuth/getCurrentUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.userAuth.token; // Get token from current Redux state

            // If token is required for this API call and not handled globally by axiosInstance interceptor
            // you might need to add it to headers here. axiosInstance should ideally handle this.
            // e.g., const response = await axiosInstance.get('/api/v1/users/get_current_user', { headers: { Authorization: `Bearer ${token}` } });

            const response = await axiosInstance.get('/api/v1/users/get_current_user');
            return response.data; // Assuming this returns the UserProfile object directly
        } catch (error: any) {
            console.error("Error fetching current user:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserData = createAsyncThunk(
    'userAuth/updateProfile',
    async (userData: { full_name: string }, { getState, rejectWithValue }) => {
        try {
            // Get the current token from Redux state for authorization
            const state = getState() as RootState; // Cast to RootState
            const token = state.userAuth.token;
            const userId = state.userAuth.user?.id; // Assuming user ID is in the state

            if (!token || !userId) {
                return rejectWithValue({ message: 'Authentication token or user ID missing.' });
            }
            const response = await axiosInstance.put(`/api/v1/users/${userId}`, userData);
            return response.data; // Should return the updated user data
        } catch (error: any) { // Add any to error type
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendFcmToken = createAsyncThunk(
    'userAuth/sendFcmToken',
    async (token: any, { getState, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/users/update_fcm_token`, token);
            return response.data; // Should return the updated user data
        } catch (error: any) { // Add any to error type
            return rejectWithValue(error.response.data);
        }
    }
);

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState: {
        loading: false,
        otpSent: false,
        user: null,
        token: null,
        error: null,
    },
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
        resetAuthStatus: (state) => {
            state.loading = false;
            state.otpSent = false;
            state.user = null;
            state.token = null;
            state.error = null;
        },
        setUserData: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
                state.error = null;
            })
            .addCase(sendOtp.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.otpSent = false;
            })
            .addCase(verifyOtpAndLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.employee; // Assuming 'employee' and 'token' keys from backend
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(verifyOtpAndLogin.rejected, (state: any, action) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })
            // update fullName 

            .addCase(updateUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.employee; // Assuming the updated employee data is returned
                state.error = null;
            })
            .addCase(updateUserData.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action: any) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;

                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                // Optionally clear user data on rejection if the fetch implies no user is logged in/available
                // state.user = null;
                // state.token = null; // Only if you want to force re-login on current user fetch failure
            })




            //send token

            .addCase(sendFcmToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendFcmToken.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.user = state.user ? { ...state.user, ...action.payload.user } : null
                state.error = null;
            })
            .addCase(sendFcmToken.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });



    },
});

export const { clearAuthError, resetAuthStatus, setUserData } = userAuthSlice.actions;

export default userAuthSlice.reducer;