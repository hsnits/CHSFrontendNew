import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./slices/api";

const store = configureStore({
  reducer: {
    API: apiSlice,
  },
});

export default store;
