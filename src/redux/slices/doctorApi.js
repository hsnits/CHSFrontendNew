import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ENDPOINTS } from "../../constants";

// MARK: Get Doctors API
export const getDoctors = createAsyncThunk("getDoctors", async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.DOCTOR.GET_DOCTORS);

    return response.data.data;
  } catch (error) {
    console.log("Get doctors Error:", error.response?.data ?? error?.message);
    throw error;
  }
});

const initialState = {
  data: {
    user: {
      getDoctorsResult: [],
    },
  },
  loading: {
    user: {
      getDoctorsLoading: false,
    },
  },
  error: {
    user: {
      getDoctorsError: "",
    },
  },
};

const doctorApiSlice = createSlice({
  name: "doctorApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MARK: Get Doctors
      .addCase(getDoctors.pending, (state) => {
        state.loading.user.getDoctorsLoading = true;
        state.error.user.getDoctorsError = "";
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading.user.getDoctorsLoading = false;
        state.data.user.getDoctorsResult = action.payload;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading.user.getDoctorsLoading = false;
        state.error.user.getDoctorsError =
          action.error.message || "Get doctors failed!";
      });
  },
});

export default doctorApiSlice.reducer;
