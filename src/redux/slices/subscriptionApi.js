import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ENDPOINTS } from "../../constants";
import { toastMessage } from "../../config/toast";

// Get all subscription plans
export const getSubscriptionPlans = createAsyncThunk(
  "getSubscriptionPlans",
  async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.SUBSCRIPTION.GET_PLANS);
      return response.data.data;
    } catch (error) {
      console.log("Get subscription plans error:", error.response?.data);
      throw error;
    }
  }
);

// Get user's current subscription
export const getUserSubscription = createAsyncThunk(
  "getUserSubscription",
  async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.SUBSCRIPTION.GET_MY_SUBSCRIPTION);
      return response.data.data;
    } catch (error) {
      console.log("Get user subscription error:", error.response?.data);
      throw error;
    }
  }
);

// Get subscription benefits
export const getSubscriptionBenefits = createAsyncThunk(
  "getSubscriptionBenefits",
  async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.SUBSCRIPTION.GET_BENEFITS);
      return response.data.data;
    } catch (error) {
      console.log("Get subscription benefits error:", error.response?.data);
      throw error;
    }
  }
);

// Create subscription order
export const createSubscriptionOrder = createAsyncThunk(
  "createSubscriptionOrder",
  async (data) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.CREATE_ORDER, data);
      return response.data.data;
    } catch (error) {
      toastMessage("error", error.response?.data?.message || "Failed to create subscription order");
      console.log("Create subscription order error:", error.response?.data);
      throw error;
    }
  }
);

// Verify subscription payment
export const verifySubscriptionPayment = createAsyncThunk(
  "verifySubscriptionPayment",
  async (data) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.VERIFY_PAYMENT, data);
      toastMessage("success", "Subscription activated successfully!");
      return response.data.data;
    } catch (error) {
      toastMessage("error", error.response?.data?.message || "Payment verification failed");
      console.log("Verify subscription payment error:", error.response?.data);
      throw error;
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  "cancelSubscription",
  async (data) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.CANCEL_SUBSCRIPTION, data);
      toastMessage("success", "Subscription cancelled successfully");
      return response.data.data;
    } catch (error) {
      toastMessage("error", error.response?.data?.message || "Failed to cancel subscription");
      console.log("Cancel subscription error:", error.response?.data);
      throw error;
    }
  }
);

// Get subscription usage
export const getSubscriptionUsage = createAsyncThunk(
  "getSubscriptionUsage",
  async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(`${ENDPOINTS.SUBSCRIPTION.GET_USAGE}?${queryParams}`);
      return response.data.data;
    } catch (error) {
      console.log("Get subscription usage error:", error.response?.data);
      throw error;
    }
  }
);

// Check benefit availability
export const checkBenefit = createAsyncThunk(
  "checkBenefit",
  async (benefitType) => {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.SUBSCRIPTION.CHECK_BENEFIT}/${benefitType}`);
      return response.data.data;
    } catch (error) {
      console.log("Check benefit error:", error.response?.data);
      throw error;
    }
  }
);

const initialState = {
  data: {
    subscription: {
      plansResult: [],
      userSubscriptionResult: null,
      benefitsResult: null,
      orderResult: null,
      usageResult: null,
      benefitCheckResult: null,
    },
  },
  loading: {
    subscription: {
      plansLoading: false,
      userSubscriptionLoading: false,
      benefitsLoading: false,
      orderLoading: false,
      paymentLoading: false,
      cancelLoading: false,
      usageLoading: false,
      benefitCheckLoading: false,
    },
  },
  error: {
    subscription: {
      plansError: "",
      userSubscriptionError: "",
      benefitsError: "",
      orderError: "",
      paymentError: "",
      cancelError: "",
      usageError: "",
      benefitCheckError: "",
    },
  },
};

const subscriptionApiSlice = createSlice({
  name: "subscriptionApi",
  initialState,
  reducers: {
    clearSubscriptionErrors: (state) => {
      state.error.subscription = {
        plansError: "",
        userSubscriptionError: "",
        benefitsError: "",
        orderError: "",
        paymentError: "",
        cancelError: "",
        usageError: "",
        benefitCheckError: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get subscription plans
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading.subscription.plansLoading = true;
        state.error.subscription.plansError = "";
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.loading.subscription.plansLoading = false;
        state.data.subscription.plansResult = action.payload;
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading.subscription.plansLoading = false;
        state.error.subscription.plansError = action.error.message || "Failed to fetch plans";
      })
      
      // Get user subscription
      .addCase(getUserSubscription.pending, (state) => {
        state.loading.subscription.userSubscriptionLoading = true;
        state.error.subscription.userSubscriptionError = "";
      })
      .addCase(getUserSubscription.fulfilled, (state, action) => {
        state.loading.subscription.userSubscriptionLoading = false;
        state.data.subscription.userSubscriptionResult = action.payload;
      })
      .addCase(getUserSubscription.rejected, (state, action) => {
        state.loading.subscription.userSubscriptionLoading = false;
        state.error.subscription.userSubscriptionError = action.error.message || "Failed to fetch subscription";
      })
      
      // Get subscription benefits
      .addCase(getSubscriptionBenefits.pending, (state) => {
        state.loading.subscription.benefitsLoading = true;
        state.error.subscription.benefitsError = "";
      })
      .addCase(getSubscriptionBenefits.fulfilled, (state, action) => {
        state.loading.subscription.benefitsLoading = false;
        state.data.subscription.benefitsResult = action.payload;
      })
      .addCase(getSubscriptionBenefits.rejected, (state, action) => {
        state.loading.subscription.benefitsLoading = false;
        state.error.subscription.benefitsError = action.error.message || "Failed to fetch benefits";
      })
      
      // Create subscription order
      .addCase(createSubscriptionOrder.pending, (state) => {
        state.loading.subscription.orderLoading = true;
        state.error.subscription.orderError = "";
      })
      .addCase(createSubscriptionOrder.fulfilled, (state, action) => {
        state.loading.subscription.orderLoading = false;
        state.data.subscription.orderResult = action.payload;
      })
      .addCase(createSubscriptionOrder.rejected, (state, action) => {
        state.loading.subscription.orderLoading = false;
        state.error.subscription.orderError = action.error.message || "Failed to create order";
      })
      
      // Verify subscription payment
      .addCase(verifySubscriptionPayment.pending, (state) => {
        state.loading.subscription.paymentLoading = true;
        state.error.subscription.paymentError = "";
      })
      .addCase(verifySubscriptionPayment.fulfilled, (state, action) => {
        state.loading.subscription.paymentLoading = false;
        state.data.subscription.userSubscriptionResult = action.payload;
      })
      .addCase(verifySubscriptionPayment.rejected, (state, action) => {
        state.loading.subscription.paymentLoading = false;
        state.error.subscription.paymentError = action.error.message || "Payment verification failed";
      })
      
      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading.subscription.cancelLoading = true;
        state.error.subscription.cancelError = "";
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading.subscription.cancelLoading = false;
        state.data.subscription.userSubscriptionResult = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading.subscription.cancelLoading = false;
        state.error.subscription.cancelError = action.error.message || "Failed to cancel subscription";
      })
      
      // Get subscription usage
      .addCase(getSubscriptionUsage.pending, (state) => {
        state.loading.subscription.usageLoading = true;
        state.error.subscription.usageError = "";
      })
      .addCase(getSubscriptionUsage.fulfilled, (state, action) => {
        state.loading.subscription.usageLoading = false;
        state.data.subscription.usageResult = action.payload;
      })
      .addCase(getSubscriptionUsage.rejected, (state, action) => {
        state.loading.subscription.usageLoading = false;
        state.error.subscription.usageError = action.error.message || "Failed to fetch usage";
      })
      
      // Check benefit
      .addCase(checkBenefit.pending, (state) => {
        state.loading.subscription.benefitCheckLoading = true;
        state.error.subscription.benefitCheckError = "";
      })
      .addCase(checkBenefit.fulfilled, (state, action) => {
        state.loading.subscription.benefitCheckLoading = false;
        state.data.subscription.benefitCheckResult = action.payload;
      })
      .addCase(checkBenefit.rejected, (state, action) => {
        state.loading.subscription.benefitCheckLoading = false;
        state.error.subscription.benefitCheckError = action.error.message || "Failed to check benefit";
      });
  },
});

export const { clearSubscriptionErrors } = subscriptionApiSlice.actions;
export default subscriptionApiSlice.reducer; 