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

// MARK: Create Appointment API
export const createAppointment = createAsyncThunk(
  "createAppointment",
  async (data) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.PATIENT.CREATE_APPOINTMENT + `/${data?.id}`,
        { refDoctor: data.refDoctor }
      );

      return response.data.data;
    } catch (error) {
      console.log(
        "Create appointment Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Get Appointment
export const getAppointment = createAsyncThunk("getAppointment", async (id) => {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.PATIENT.GET_APPOINTMENT + `/${id}`
    );

    return response.data.data;
  } catch (error) {
    console.log(
      "Get Appointment Error:",
      error.response?.data ?? error?.message
    );
    throw error;
  }
});

const initialState = {
  data: {
    user: {
      updatePatientProfileResult: [],
      getAppointmentResult: [],
      createAppointmentResult: [],
    },
  },
  loading: {
    user: {
      updatePatientProfileLoading: false,
      getAppointmentLoading: true,
      createAppointmentLoading: false,
    },
  },
  error: {
    user: {
      updatePatientProfileError: "",
      getAppointmentError: "",
      createAppointmentError: "",
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
      })
      // MARK: Get Appointment
      .addCase(getAppointment.pending, (state) => {
        state.loading.user.getAppointmentLoading = true;
        state.error.user.getAppointmentError = "";
      })
      .addCase(getAppointment.fulfilled, (state, action) => {
        state.loading.user.getAppointmentLoading = false;
        state.data.user.getAppointmentResult = action.payload;
      })
      .addCase(getAppointment.rejected, (state, action) => {
        state.loading.user.getAppointmentLoading = false;
        state.error.user.getAppointmentError =
          action.error.message || "Get Appointment failed!";
      }) // MARK: Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading.user.createAppointmentLoading = true;
        state.error.user.createAppointmentError = "";
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading.user.createAppointmentLoading = false;
        state.data.user.createAppointmentResult = action.payload;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading.user.createAppointmentLoading = false;
        state.error.user.createAppointmentError =
          action.error.message || "Get doctors failed!";
      });
  },
});

export default patientApiSlice.reducer;
