import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from '../services/axiosInstance'
import { errorBlock } from "../utils/helper";

export const getInstantJobs = createAsyncThunk<any, any, { rejectValue: any }>(
  'employee@instantjobs',
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/v1/instant_jobs/get_jobs_by_cords`, data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(errorBlock(err));
    }
  }
);

export const getInstantJobById = createAsyncThunk<any, any, { rejectValue: any }>(
  'employee@instantjob',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/instant_jobs/${id}`);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(errorBlock(err));
    }
  }
);

export const getInstantJobApply = createAsyncThunk<any, any, { rejectValue: any }>(
  'employee@instantjobApply',
  async ({id, ...params}, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/v1/instant_jobs/${id}/instant_job_applications`, params);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(errorBlock(err));
    }
  }
);

export const getInstantJobCancel = createAsyncThunk<any, any, { rejectValue: any }>(
  'employee@instantjobCancel',
  async ({id, ...params}, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/v1/instant_jobs/${id}/instant_job_applications/cancel_application`, params);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(errorBlock(err));
    }
  }
);

const initialState: any = {
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  geocoords: {},
  currentInstantJob: {},

  applyJobLoading: false,
  distance: 10
};

export const instantJobsSlice = createSlice({
  name: "instantjobs",
  initialState,
  reducers: {
    clearState: () => initialState,
    clearSuccess: () => (initialState.isSuccess = false),
    setCoords: (state, action) =>{
      state.geocoords = action.payload;
    },
    setDistance: (state, action) =>{
        state.distance = action.payload;
    },
  

  },
  extraReducers: (builder: any) => {
    builder.addCase(getInstantJobs.pending, (state: any) => {
      state.isLoading = true;
    });
    builder.addCase(getInstantJobs.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getInstantJobs.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.isError = false;
    });

    builder.addCase(getInstantJobById.pending, (state: any) => {
      state.isLoading = true;
    });
    builder.addCase(getInstantJobById.fulfilled, (state: any, action: any) => {
 
      state.isLoading = false;
      state.isSuccess = true;
      state.currentInstantJob = action.payload;
    });
    builder.addCase(getInstantJobById.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.isError = false;
    });


    //Instant job apply 

    builder.addCase(getInstantJobApply.pending, (state: any) => {
      state.applyJobLoading = true;
    });
    builder.addCase(getInstantJobApply.fulfilled, (state: any, action: any) => {
      const application = action.payload.application
      state.applyJobLoading = false;
      state.isSuccess = true;
      state.currentInstantJob = {...state.currentInstantJob, archived: application.archived,final_price: application.final_price, application_status: application.status };
    });
    builder.addCase(getInstantJobApply.rejected, (state: any, action: any) => {
      state.applyJobLoading = false;
      state.error = action.payload.error;
      state.isError = false;
    });

    //cancel job 
    builder.addCase(getInstantJobCancel.pending, (state: any) => {
      state.applyJobLoading = true;
    });
    builder.addCase(getInstantJobCancel.fulfilled, (state: any, action: any) => {
      state.applyJobLoading = false;
      state.isSuccess = true;
      state.currentInstantJob = {...state.currentInstantJob, archived: false,final_price: undefined, application_status: 'pending' };
    });
    builder.addCase(getInstantJobCancel.rejected, (state: any, action: any) => {
      state.applyJobLoading = false;
      state.error = action.payload.error;
      state.isError = false;
    });


    
  }
})

export const { clearState, clearSuccess, setCoords, setDistance } = instantJobsSlice.actions;
export default instantJobsSlice.reducer;