// src/redux/videoUploadSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Alert, Platform } from 'react-native';
import { Video } from 'react-native-compressor';
import RNFS from 'react-native-fs';
import { isValidFile, trim } from 'react-native-video-trim';

// Import your configured axios instance
import axiosInstance from '../services/axiosInstance'; // Adjust path as needed

const MAX_DURATION_SECONDS = 60; // Max duration for the trimmed video

// Define the shape of your state
interface VideoUploadState {
  selectedVideoUri: string | null;
  processedVideoUri: string | null;
  processing: boolean;
  uploading: boolean;
  progress: number; // 0-1
  uploadComplete: boolean;
  error: string | null;
  videos: any;
}

const initialState: VideoUploadState = {
  selectedVideoUri: null,
  processedVideoUri: null,
  processing: false,
  uploading: false,
  progress: 0,
  uploadComplete: false,
  error: null,
  videos: []
};

// Async Thunk for processing (trimming + compression)
export const processAndCompressVideo = createAsyncThunk(
  'videoUpload/processAndCompress',
  async ({ uri, duration }: { uri: string; duration: number | undefined }, { dispatch, rejectWithValue }) => {
    dispatch(videoUploadSlice.actions.setProcessing(true));
    dispatch(videoUploadSlice.actions.setError(null)); // Clear previous errors
    dispatch(videoUploadSlice.actions.setProgress(0));

    try {
      let fileUriToCompress = uri;

      // 1. Validate and Trim (if needed)
      const videoIsValid = await isValidFile(uri);
      if (!videoIsValid) {
        Alert.alert('Error', 'Invalid video file selected or cannot be accessed.');
        return rejectWithValue('Invalid video file.');
      }

      if (duration && duration > MAX_DURATION_SECONDS) {
        // Alert.alert(
        //   'Video Too Long',
        //   `The selected video is longer than ${MAX_DURATION_SECONDS} seconds. It will be trimmed.`
        // );
        const startTime = 0;
        const endTime = MAX_DURATION_SECONDS;

        const trimResult = await trim(uri, {
          startTime: startTime * 1000,
          endTime: endTime * 1000,
        });
        // IMPORTANT: react-native-video-trim's `trim` returns an object, access `source`
        fileUriToCompress = trimResult; 
        console.log('DEBUG: Trimmed video URI:', fileUriToCompress);

        if (!fileUriToCompress) {
          throw new Error("Trimming resulted in an empty URI.");
        }
      } else {
        // Alert.alert('Compressing Video', 'Video is within duration. Starting compression...');
      }

      // 2. Compress
    //   Alert.alert('Compressing Video', 'Please wait, video compression is in progress...');
      const compressedUri = await Video.compress(
        fileUriToCompress,
        {
          compressionMethod: 'auto',
          quality: 'low',
        },
        (progressValue) => {
          dispatch(videoUploadSlice.actions.setProgress(progressValue));
          console.log(`Compression Progress: ${Math.round(progressValue * 100)}%`);
        }
      );

      console.log('Compressed video URI:', compressedUri);
      const fileSizeMB = ((await RNFS.stat(compressedUri)).size / (1024 * 1024)).toFixed(2);
    //   Alert.alert('Success', `Video processed! Size: ${fileSizeMB} MB`);

      return compressedUri; // This will be the payload for `fulfilled`
    } catch (err: any) {
      console.error('Video processing failed:', err);
      Alert.alert('Error', `Failed to process video: ${err.message || 'Unknown error'}`);
      return rejectWithValue(err.message || 'Failed to process video.');
    } finally {
      dispatch(videoUploadSlice.actions.setProcessing(false));
      dispatch(videoUploadSlice.actions.setProgress(0));
    }
  }
);

// Async Thunk for uploading using axiosInstance
export const uploadVideo = createAsyncThunk(
  'videoUpload/upload',
  async (uriToUpload: string, { dispatch, rejectWithValue }) => {
    dispatch(videoUploadSlice.actions.setUploading(true));
    dispatch(videoUploadSlice.actions.setError(null)); // Clear previous errors
    dispatch(videoUploadSlice.actions.setProgress(0));
    dispatch(videoUploadSlice.actions.setUploadComplete(false));

    try {
      const fileInfo = await RNFS.stat(uriToUpload);
      const fileName = uriToUpload.split('/').pop();
      const fileType = 'video/mp4'; // Assume MP4, adjust if handling other types

      const formData = new FormData();
      formData.append('video', {
        uri: uriToUpload,
        name: fileName,
        type: fileType,
      } as any); // Use 'as any' due to FormData type limitations with RN file URIs

      // Use axiosInstance for the POST request
      const response = await axiosInstance.post('/api/v1/employees/upload_video', formData, { // Adjust '/upload-video' to your actual endpoint
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? progressEvent.loaded / progressEvent.total
            : 0;
          dispatch(videoUploadSlice.actions.setProgress(percent));
          console.log(`Upload Progress: ${Math.round(percent * 100)}%`);
        },
      });

      console.log('Upload successful:', response.data);
    //   Alert.alert('Success', 'Video uploaded successfully!');
      dispatch(videoUploadSlice.actions.setUploadComplete(true));
      return response.data; // Resolve with response data

    } catch (err: any) {
      console.error('Upload error:', err);
      // Axios errors have a 'response' property for server errors
      const errorMessage = err.response?.data?.message || err.message || 'Unknown upload error.';
      Alert.alert('Error', `Failed to upload video: ${errorMessage}`);
      dispatch(videoUploadSlice.actions.setUploadComplete(false));
      return rejectWithValue(errorMessage); // Reject with error message
    } finally {
      dispatch(videoUploadSlice.actions.setUploading(false));
      dispatch(videoUploadSlice.actions.setProgress(0));
    }
  }
);


export const videoUploadSlice = createSlice({
  name: 'videoUpload',
  initialState,
  reducers: {
    resetState: (state) => {
      Object.assign(state, initialState); // Reset all state to initial
    },
    setSelectedVideoUri: (state, action: PayloadAction<string | null>) => {
      state.selectedVideoUri = action.payload;
      state.processedVideoUri = null; // Reset processed video when new selected
      state.uploadComplete = false; // Reset upload status
      state.error = null; // Clear error
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setUploadComplete: (state, action: PayloadAction<boolean>) => {
      state.uploadComplete = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVideos: (state,action: any) =>{
        state.videos = action.payload.video_urls;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processAndCompressVideo.fulfilled, (state, action: PayloadAction<string>) => {
        state.processedVideoUri = action.payload;
        state.error = null;
        // The upload will be triggered separately if processAndCompressVideo succeeds
      })
      .addCase(processAndCompressVideo.rejected, (state, action) => {
        state.error = action.payload as string;
        state.processedVideoUri = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action: any) => {
        state.uploadComplete = true;
        state.videos =  action.payload.video_urls
        state.error = null;
      })
      .addCase(uploadVideo.rejected, (state: any, action: any) => {
 
        state.error = action.payload as string;
        state.uploadComplete = false;
      });
  },
});

export const {
  resetState,
  setSelectedVideoUri,
  setProcessing,
  setUploading,
  setProgress,
  setUploadComplete,
  setError,
  setVideos,
} = videoUploadSlice.actions;

export default videoUploadSlice.reducer;