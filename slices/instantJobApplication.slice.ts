// src/slices/instantJob.slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../services/axiosInstance';
import { errorBlock } from '../utils/helper';



export const getAppliedJobs = createAsyncThunk<{ rejectValue: any }>(
    'job@jobApplication',
    async (id, thunkAPI) => {
      try {
        const response = await axiosInstance.get(`/api/v1/instant_jobs/${id}/instant_job_applications`);
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(errorBlock(err));
      }
    }
  );




  export const updateApplicationStatus = createAsyncThunk<{ rejectValue: any }>(
    'job@updatejobApplication',
    async ({id,applicationId, status }: any, thunkAPI) => {
      try {
        const response = await axiosInstance.put(`/api/v1/instant_jobs/${id}/instant_job_applications/${applicationId}/update_status`,{ status });
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(errorBlock(err));
      }
    }
  );

  export const revokeApplication = createAsyncThunk<{ rejectValue: any }>(
    'job@revokejobApplication',
    async ({id }: any, thunkAPI) => {
      try {
        const response = await axiosInstance.get(`/api/v1/instant_jobs/${id}/instant_job_applications/revoke_application`);
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(errorBlock(err));
      }
    }
  );
  
  
  
const instantJobApplicationSlice = createSlice({
    name: 'instantJobApplication',
    initialState: {
        loading: false,
        success: false,
        error: null as any | null,
        appliedApplications: [] as any | null, // To store the posted job data

        loading1: false,
        success1: false,
        error1: null,

       revokeLoading: false,
       revokeSuccess: false,
       revokeError: null,
    },
    reducers: {
        clearInstantJobError: (state) => {
            state.error = null;
        },
        resetInstantJobState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.appliedApplications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAppliedJobs.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.appliedApplications = []
            })
            .addCase(getAppliedJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.appliedApplications = action.payload;
                state.error = null;
            })
            .addCase(getAppliedJobs.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                state.appliedApplications = [];
            }).addCase(updateApplicationStatus.pending, (state) => {
                state.loading1 = true;
                state.success1 = false;
                state.error1 = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action: any) => {
                state.loading1 = false;
                state.success1 = true;
                state.appliedApplications = action.payload;
                state.error = null;
            })
            .addCase(updateApplicationStatus.rejected, (state: any, action) => {
                state.loading1 = false;
                state.success1 = false;
                state.error1 = action.payload;
                state.appliedApplications = [];
            }).addCase(revokeApplication.pending, (state) => {
                state.revokeLoading = true;
                state.revokeSuccess = false;
                state.revokeError = null;
            })
            .addCase(revokeApplication.fulfilled, (state, action: any) => {
                state.revokeLoading = false;
                state.revokeSuccess = true;
                state.appliedApplications = action.payload;
                state.revokeError = null;
            })
            .addCase(revokeApplication.rejected, (state: any, action) => {
                state.revokeLoading = false;
                state.revokeSuccess = false;
                state.revokeError = action.payload;
                state.appliedApplications = [];
            });


            
    }
});

export const { clearInstantJobError, resetInstantJobState } = instantJobApplicationSlice.actions;

export default instantJobApplicationSlice.reducer;