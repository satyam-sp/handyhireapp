import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from '../services/axiosInstance'
import { errorBlock, showToastMessage } from "../utils/helper";
import axios from "axios";
import { getToken, removeStorageData } from "../utils/storage-helper";


export const registerEmployee = createAsyncThunk<any, any, { rejectValue: any }>(
  'register@employee',
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/v1/employees/register_step`, data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(errorBlock(err));
    }
  }
);

export const loginEmployee = createAsyncThunk<any, any, { rejectValue: any }>(
  'login@employee',
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/employees/login', data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(errorBlock(err));
    }
  }
);

export const uploadEmployeeImage = createAsyncThunk<any, any, { rejectValue: any }>(
  'uploadImage@employee',
  async (image, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: image.path,
        name: image.filename || 'avatar.jpg',
        type: image.mime || 'image/jpeg',
      });
      const token = await getToken('employee');


      const response = await axiosInstance.patch(`/api/v1/employees/update_avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':`Bearer ${token}`
        },
      });
      showToastMessage('success', 'Upload Successfully', 'Done');

      return response.data;

    } catch (err: any) {
      let errorMessage = 'Something went wrong';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.errors?.join('\n') || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showToastMessage('error', 'Upload Failed', errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);





export const logout = createAsyncThunk('logout', async () =>{
  try {
    await removeStorageData('employee');
    await removeStorageData('user');
  }catch(e){
    
  }
})
const initialState: any = {
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  empRegisterData: {},
  employee: {}
};

export const registerSlice = createSlice({
  name: "empregister",
  initialState,
  reducers: {
    clearState: () => initialState,
    clearSuccess: () => (initialState.isSuccess = false),
    setEmployee: (state, action) =>{
      state.employee = action.payload;
    },
    appendEmployeeRegisterData: (state, action) => {
      state.empRegisterData = {
        ...state.empRegisterData,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(registerEmployee.pending, (state: any) => {
      state.isLoading = true;
    });
    builder.addCase(registerEmployee.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(registerEmployee.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.isError = false;
    });

    // upload image
    builder.addCase(uploadEmployeeImage.pending, (state: any) => {
      state.uploadLoading = true;
    });
    builder.addCase(uploadEmployeeImage.fulfilled, (state: any, action: any) => {
      state.uploadLoading = false;
      state.isSuccess = true;
      state.employee.avatar = action.payload.avatar_url; // Update with actual key
    });
    builder.addCase(uploadEmployeeImage.rejected, (state: any, action: any) => {
      state.uploadLoading = false;
      state.error = action.payload;
      state.isError = true;
    });
  }
})

export const { clearState, clearSuccess, appendEmployeeRegisterData, setEmployee } = registerSlice.actions;
export default registerSlice.reducer;