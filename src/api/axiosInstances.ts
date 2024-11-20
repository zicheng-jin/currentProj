import axios, { AxiosInstance, AxiosError } from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // TODO: handle 401
          break;
        case 500:
          // TODO: handle 500
          break;
        default:
          console.log(`An error occurred: ${error.response.statusText}`);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;