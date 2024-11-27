import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ENDPOINTS } from "../../constants";

// MARK: Update Patient Profile API
export const updatePatientProfile = createAsyncThunk(
  "updatePatientProfile",
  async (data) => {
    try {
      const response = await axiosInstance.put(
        ENDPOINTS.PATIENT.UPDATE_PROFILE + `/${data.id}`,
        data
      );
      if (response.status === 200) {
        alert("Profile Updated Successfully!");
      }
      return response.data.data;
    } catch (error) {
      console.log(
        "Update Patient Profile Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

const initialState = {
  data: {
    user: {
      updatePatientProfileResult: [],
    },
  },
  loading: {
    user: {
      updatePatientProfileLoading: false,
    },
  },
  error: {
    user: {
      updatePatientProfileError: "",
    },
  },
};

const patientApiSlice = createSlice({
  name: "patientApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MARK: Update Patient Profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading.user.updatePatientProfileLoading = true;
        state.error.user.updatePatientProfileError = "";
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.loading.user.updatePatientProfileLoading = false;
        state.data.user.updatePatientProfileResult = action.payload;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading.user.updatePatientProfileLoading = false;
        state.error.user.updatePatientProfileError =
          action.error.message || "Patient profile update failed!";
      });
  },
});

export default patientApiSlice.reducer;
