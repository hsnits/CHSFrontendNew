import { configureStore } from "@reduxjs/toolkit";
import userApiSlice from "./slices/userApi";

const store = configureStore({
  reducer: {
    USER_API: userApiSlice,
  },
});

export default store;
