import axios from "axios";
import { STORAGE } from "../constants";
const BASE_URL = "http://localhost:5000";
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE.USER_KEY);
    const parsedValue = JSON.parse(token);
    if (parsedValue?.accessToken) {
      config.headers.Authorization = `Bearer ${parsedValue?.accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
