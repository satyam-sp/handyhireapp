// src/slices/instantJob.slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../services/axiosInstance';
import { errorBlock } from '../utils/helper';

// Define the type for the instant job data
interface InstantJobPostPayload {
    title: string;
    description: string;
    job_category_id: number;
    slot_date: string; // Assuming format like 'YYYY-MM-DD'
    slot_time: string; // Assuming format like 'HH:MM AM/PM - HH:MM AM/PM'
    rate_type: number; // e.g., 0 for Per Hour, 1 for Per Day, 2 for Per Job
    price: string; // Stored as string from TextInput, typically parsed to number on backend
    image_urls: string[]; // Array of URLs for uploaded images
    address_line_1: string;
    address_line_2: string; // Can be an empty string if not used
    city: string;
    state: string;
    zip_code: string;
    latitude?: number; // Optional, as it might fall back to a default value if not provided
    longitude?: number; // Optional, as it might fall back to a default value if not provided
}
// Async Thunk for posting an instant job
export const postInstantJob = createAsyncThunk(
    'instantJob/postInstantJob',
    async (jobData: InstantJobPostPayload, { getState, rejectWithValue }) => {
        try {
            // Get the authentication token from your userAuth slice
            const state = getState() as RootState; // Cast to RootState
            const token = state.userAuth.token;

            if (!token) {
                return rejectWithValue({ message: 'Authentication token missing. Please log in.' });
            }

            const response = await axiosInstance.post(
                `/api/v1/instant_jobs`, // Assuming this is your API endpoint
                jobData
            );
            return response.data; // Should return the created job data
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const getActiveJobs = createAsyncThunk<{ rejectValue: any }>(
    'user@ActiveJobs',
    async (_, thunkAPI) => {
      try {
        const response = await axiosInstance.get('/api/v1/instant_jobs/get_active_jobs');
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(errorBlock(err));
      }
    }
  );
  
const instantJobSlice = createSlice({
    name: 'instantJob',
    initialState: {
        loading: false,
        success: false,
        error: null as any | null,
        job: null as any | null, // To store the posted job data


        activeJobsLoading: true,
        activeJobs: [] as any,
        activeJobsError: null as any,
    },
    reducers: {
        clearInstantJobError: (state) => {
            state.error = null;
        },
        resetInstantJobState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.job = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postInstantJob.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(postInstantJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.job = action.payload;
                state.error = null;
            })
            .addCase(postInstantJob.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                state.job = null;
            });

        // Active Jobs

        builder
        .addCase(getActiveJobs.pending, (state) => {
            state.activeJobsLoading = true;
            state.activeJobsError = null;
        })
        .addCase(getActiveJobs.fulfilled, (state, action) => {
            state.activeJobsLoading = false;
            state.activeJobs = action.payload;
            state.activeJobsError = null;
        })
        .addCase(getActiveJobs.rejected, (state, action) => {
            state.activeJobsLoading = false;
            state.activeJobsError = action.payload;
            state.activeJobs = [];
        });
    },
});

export const { clearInstantJobError, resetInstantJobState } = instantJobSlice.actions;

export default instantJobSlice.reducer;