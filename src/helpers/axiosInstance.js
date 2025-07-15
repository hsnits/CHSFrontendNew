import axios from "axios";
import { STORAGE } from "../constants";
import { getLocalStorage } from "./storage";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/";
// const BASE_URL = "http://localhost:5000/";
// const BASE_URL =  "https://api.chshealthcare.in/" ;

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

// Add API helper functions
export const getDataAPI = async (url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    return response.data;
  } catch (error) {
    console.error("GET API Error:", error);
    throw error;
  }
};

export const postDataAPI = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error("POST API Error:", error);
    throw error;
  }
};

export const putDataAPI = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error("PUT API Error:", error);
    throw error;
  }
};

export const deleteDataAPI = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    console.error("DELETE API Error:", error);
    throw error;
  }
};
