import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // const authToken = getClientCookie("token");
    // if (authToken) {
    //   config.headers.Authorization = `Bearer ${authToken}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    if (detail?.includes("Token has expired")) {
      localStorage.clear();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    // console.log(`API call response:`, response);
    return response.data;
  } catch (error) {
    console.error(`API call error:`, error);

    if (error.response.status !== 500) {
      let errorType = error?.response?.data;

      if (errorType?.message?.includes("24 character hex string")) {
        window.location.replace("/home");
      }

      return {
        status: false,
        message: errorType?.message || "Something went wrong ,try again later",
      };
    }

    throw error;
  }
};

export const callPostApi = (url, payload, config = {}) =>
  handleApiCall(() => axiosInstance.post(url, payload, config));

export const callPutApi = (url, payload, config = {}) =>
  handleApiCall(() => axiosInstance.put(url, payload, config));

export const callGetApi = (url, config = {}) =>
  handleApiCall(() => axiosInstance.get(url, config));

export const callDeleteApi = (url, config = {}) =>
  handleApiCall(() => axiosInstance.delete(url, config));

export const callPatchApi = (url, payload, config = {}) =>
  handleApiCall(() => axiosInstance.patch(url, payload, config));

export default axiosInstance;
