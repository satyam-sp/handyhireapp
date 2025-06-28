import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerSlice from "./slices/register.slice";
import  instantJobsSlice  from "./slices/instantjobs.slice";

export default configureStore({
    reducer: {
        register: registerSlice,
        instantjobs: instantJobsSlice
    }
})