import axios from "axios";
import { STORAGE } from "../constants";
import { getLocalStorage } from "./storage";
const BASE_URL =
  "http://3.228.233.9:5000/" || process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage(STORAGE.USER_KEY);
    if (token?.accessToken) {
      config.headers.Authorization = `Bearer ${token?.accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
