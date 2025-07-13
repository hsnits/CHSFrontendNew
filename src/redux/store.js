import { configureStore } from "@reduxjs/toolkit";
import userApiSlice from "./slices/userApi";
import patientSlice from "./slices/patientApi";
import doctorSlice from "./slices/doctorApi";
import pathologySlice from "./slices/pathologyApi";

const store = configureStore({
  reducer: {
    USER: userApiSlice,
    PATIENT: patientSlice,
    DOCTOR: doctorSlice,
    PATHOLOGY: pathologySlice,
  },
});

export default store;
