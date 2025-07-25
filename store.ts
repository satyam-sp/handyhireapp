import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerSlice from "./slices/register.slice";
import  instantJobsSlice  from "./slices/instantjobs.slice";
import videoUploadSlice from './slices/videoUpload.slice';
import userAuthReducer from './slices/userAuth.slice';
import instatntJobSlice from './slices/instantJob.slice'
import userAddressReducer from './slices/userAddress.slice'
import instantJobApplicationSlice from './slices/instantJobApplication.slice'
import notificationsSlice  from './slices/notifications.slice'
export const store = configureStore({
    reducer: {
        register: registerSlice,
        instantjobs: instantJobsSlice,
        instantjob: instatntJobSlice,
        videoUpload: videoUploadSlice,
        userAuth: userAuthReducer,
        userAddress: userAddressReducer, // <--- ADD NEW REDUCER HERE
        instantJobApplications: instantJobApplicationSlice,
        notifications: notificationsSlice, // <-- NEW

    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;