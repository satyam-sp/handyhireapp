// src/slices/notifications.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';

// Define your API base URL (e.g., from .env file)

// Define the structure of a single Notification object
interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string; // ISO 8601 string
  notifiable_type: string;
  notifiable_id: number;
  recipient_type: 'user' | 'employee';
  job_title?: string; // Optional, populated by serializer
  sender_name?: string; // Optional, populated by serializer
}

// Define the state structure for the notifications slice
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async Thunk to fetch notifications
export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/notifications`);
      return response.data; // This should be an array of Notification objects
    } catch (error: any) {
      // Handle API errors
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Async Thunk to mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId: number, { rejectWithValue, getState }) => {
    try {
      

      const response = await axiosInstance.patch(`/api/v1/notifications/${notificationId}/mark_as_read`,{});
      // Assuming the API returns the updated notification object
      return response.data.notification;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Reducer to clear notifications on logout (optional, but good practice)
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getNotifications async thunk
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action: any) => {
        state.loading = false;
        
        state.notifications = action.payload.data;
        // Calculate unread count based on the fetched notifications
        state.unreadCount = action.payload.data.filter((n: any) => !n.attributes.read).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle markNotificationAsRead async thunk
      .addCase(markNotificationAsRead.fulfilled, (state, action: any) => {
        // Find the updated notification and replace it in the state
        const index = state.notifications.findIndex(n => n.id === action.payload.data.id);
        if (index !== -1) {
          state.notifications[index] = action.payload.data;
          // Recalculate unread count
          state.unreadCount = state.notifications.filter(n => !n.read).length;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        console.error("Failed to mark notification as read:", action.payload);
        // You might want to show a toast or alert to the user here
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;