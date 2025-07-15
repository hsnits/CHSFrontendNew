import { configureStore } from "@reduxjs/toolkit";
import userApiSlice from "./slices/userApi";
import patientSlice from "./slices/patientApi";
import doctorSlice from "./slices/doctorApi";
import pathologySlice from "./slices/pathologyApi";
import subscriptionSlice from "./slices/subscriptionApi";

const store = configureStore({
  reducer: {
    USER: userApiSlice,
    PATIENT: patientSlice,
    DOCTOR: doctorSlice,
    PATHOLOGY: pathologySlice,
    SUBSCRIPTION: subscriptionSlice,
  },
});

export default store;
