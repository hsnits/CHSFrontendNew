import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ENDPOINTS, STORAGE } from "../../constants";

// MARK: Login API
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (credentials) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.USER.LOGIN,
        credentials
      );
      await localStorage.setItem(
        STORAGE.USER_KEY,
        JSON.stringify(response.data?.data)
      );
      return response.data;
    } catch (error) {
      console.log("Login Error:", error.response?.data ?? error?.message);
      throw error;
    }
  }
);

// MARK: Registration API
export const registerUser = createAsyncThunk(
  "login/registerUser",
  async (credentials) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.USER.REGISTER,
        credentials
      );
      return response.data;
    } catch (error) {
      console.log(
        "Registration Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: User Profile API
export const userProfile = createAsyncThunk("login/userProfile", async () => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.USER.REGISTER);
    return response.data;
  } catch (error) {
    console.log("User Profile Error:", error.response?.data ?? error?.message);
    throw error;
  }
});

const initialState = {
  data: {
    user: {
      loginResult: [],
      registerResult: [],
      userProfileResult: [],
    },
  },
  loading: {
    user: {
      loginLoading: false,
      registerLoading: false,
      userProfileLoading: false,
    },
  },
  error: {
    user: {
      loinError: "",
      registerError: "",
      userProfileError: "",
    },
  },
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MARK: Login User
      .addCase(loginUser.pending, (state) => {
        state.loading.user.loginLoading = true;
        state.error.user.loinError = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.user.loginLoading = false;
        state.data.user.loginResult = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.user.loginLoading = false;
        state.error.user.loinError = action.error.message || "Login failed!";
      })
      // MARK: Register User
      .addCase(registerUser.pending, (state) => {
        state.loading.user.registerLoading = true;
        state.error.user.registerError = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.user.registerLoading = false;
        state.data.user.registerResult = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.user.registerLoading = false;
        state.error.user.registerError =
          action.error.message || "Registration failed!";
      })
      // MARK: Get User Profile
      .addCase(userProfile.pending, (state) => {
        state.loading.user.userProfileLoading = true;
        state.error.user.userProfileError = "";
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading.user.userProfileLoading = false;
        state.data.user.userProfileResult = action.payload;
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.loading.user.userProfileLoading = false;
        state.error.user.userProfileError =
          action.error.message || "User profile fetch failed!";
      });
  },
});

export default apiSlice.reducer;
