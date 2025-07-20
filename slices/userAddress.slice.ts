// src/slices/userAddress.slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // Assuming you have this config
import { RootState } from '../store'; // For getState typing
import axiosInstance from '../services/axiosInstance';

// Define the Address type (should match your Rails model)
export interface Address {
    id: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip_code: string;
    address_type: 'Home' | 'Work' | 'Friend' | 'Other' | 'Current';
    latitude?: number;
    longitude?: number;
    created_at?: string; // Add if your API returns timestamps
    updated_at?: string; // Add if your API returns timestamps
}

interface UserAddressState {
    addresses: Address[];
    loading: boolean;
    error: any | null;
}

const initialState: UserAddressState = {
    addresses: [],
    loading: false,
    error: null,
};

// Async Thunk for fetching all addresses for the current user
export const fetchAddresses = createAsyncThunk(
    'userAddress/fetchAddresses',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userAuth.token;

            if (!token) {
                return rejectWithValue({ message: 'Authentication token missing. Please log in.' });
            }

            const response = await  axiosInstance.get(`/api/v1//addresses`);
            return response.data; // Array of addresses
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for adding a new address
export const addAddress = createAsyncThunk(
    'userAddress/addAddress',
    async (newAddressData: Omit<Address, 'id' | 'created_at' | 'updated_at'>, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userAuth.token;

            if (!token) {
                return rejectWithValue({ message: 'Authentication token missing. Please log in.' });
            }

            const response = await  axiosInstance.post(`/api/v1/addresses`, { address: newAddressData });
            return response.data; // The newly created address object
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for deleting an address
export const deleteAddress = createAsyncThunk(
    'userAddress/deleteAddress',
    async (addressId: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userAuth.token;

            if (!token) {
                return rejectWithValue({ message: 'Authentication token missing. Please log in.' });
            }

            await axiosInstance.delete(`/api/v1/addresses/${addressId}`);
            return addressId; // Return the ID of the deleted address
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userAddressSlice = createSlice({
    name: 'userAddress',
    initialState,
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
        // This action can be used to manually add a 'Current Location' address
        // that isn't persisted to the backend
        addTemporaryAddress: (state, action) => {
            // Check if a 'Current' address already exists and replace it
            const existingCurrentIndex = state.addresses.findIndex(addr => addr.id === 'current_location');
            if (existingCurrentIndex !== -1) {
                state.addresses[existingCurrentIndex] = action.payload;
            } else {
                state.addresses.push(action.payload);
            }
        },
        removeTemporaryAddress: (state, action) => {
             state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload; // Replace with fetched addresses
                state.error = null;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload); // Add new address to the list
                state.error = null;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Address
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(
                    (address) => address.id !== action.payload
                ); // Remove deleted address
                state.error = null;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAddressError, addTemporaryAddress, removeTemporaryAddress } = userAddressSlice.actions;

export default userAddressSlice.reducer;