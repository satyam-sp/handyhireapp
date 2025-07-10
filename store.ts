import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerSlice from "./slices/register.slice";
import  instantJobsSlice  from "./slices/instantjobs.slice";
import videoUploadSlice from './slices/videoUpload.slice';
import userAuthReducer from './slices/userAuth.slice';

export const store = configureStore({
    reducer: {
        register: registerSlice,
        instantjobs: instantJobsSlice,
        videoUpload: videoUploadSlice,
        userAuth: userAuthReducer

    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;