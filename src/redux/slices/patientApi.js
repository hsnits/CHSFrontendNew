import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ENDPOINTS } from "../../constants";
import { toastMessage } from "../../config/toast";

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
        toastMessage("success", "Profile Updated Successfully!");
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

// MARK: Update Appointment API
export const updateAppointment = createAsyncThunk(
  "updateAppointment",
  async (data) => {
    try {
      const response = await axiosInstance.put(
        ENDPOINTS.PATIENT.UPDATE_APPOINTMENT + `/${data?.id}`,
        data
      );

      return response.data.data;
    } catch (error) {
      console.log(
        "Update appointment Error:",
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

// MARK: Get All Appointment
export const getAllAppointment = createAsyncThunk(
  "getAllAppointment",
  async (id) => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.PATIENT.GET_ALL_APPOINTMENT + `/${id}`
      );

      return response.data.data;
    } catch (error) {
      console.log(
        "Get All Appointment Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Update Appointment Status
export const updateAppointmentStatus = createAsyncThunk(
  "updateAppointmentStatus",
  async ({ data }) => {
    // Where `data.id` is appointment ID
    try {
      const response = await axiosInstance.put(
        ENDPOINTS.PATIENT.GET_ALL_APPOINTMENT + `/${data.id}`,
        { status: data.status }
      );
      toastMessage("success", response?.data?.message);

      return response.data.data;
    } catch (error) {
      console.log(
        "Appointment Update Status Error:",
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
      getAppointmentResult: [],
      getAllAppointmentResult: [],
      createAppointmentResult: [],
      updateAppointmentResult: [],
    },
  },
  loading: {
    user: {
      updatePatientProfileLoading: false,
      getAppointmentLoading: true,
      getAllAppointmentLoading: true,
      createAppointmentLoading: false,
      updateAppointmentLoading: false,
    },
  },
  error: {
    user: {
      updatePatientProfileError: "",
      getAppointmentError: "",
      getAllAppointmentError: "",
      createAppointmentError: "",
      updateAppointmentError: "",
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
      })
      // MARK: Get All Appointment
      .addCase(getAllAppointment.pending, (state) => {
        state.loading.user.getAllAppointmentLoading = true;
        state.error.user.getAppointmentError = "";
      })
      .addCase(getAllAppointment.fulfilled, (state, action) => {
        state.loading.user.getAllAppointmentLoading = false;
        state.data.user.getAllAppointmentResult = action.payload;
      })
      .addCase(getAllAppointment.rejected, (state, action) => {
        state.loading.user.getAllAppointmentLoading = false;
        state.error.user.getAppointmentError =
          action.error.message || "Get All Appointment failed!";
      })
      // MARK: Create Appointment
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
          action.error.message || "Create Appointment failed!";
      })
      // MARK: Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading.user.updateAppointmentLoading = true;
        state.error.user.updateAppointmentError = "";
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading.user.updateAppointmentLoading = false;
        state.data.user.updateAppointmentResult = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading.user.updateAppointmentLoading = false;
        state.error.user.updateAppointmentError =
          action.error.message || "Update Appointment failed!";
      });
  },
});

export default patientApiSlice.reducer;
