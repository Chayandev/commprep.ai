import axios from "axios";
import { store } from "../src/app/store.js"; // Make sure this is initialized first
import { handleSessionExpiry } from "../src/features/sessionHandlerSlice.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enables sending cookies with requests
});

//const dispatch = store.dispatch;

let isRefreshing = false;
let isSessionExpired = false;

// Axios Request Interceptor (to dynamically handle headers)
api.interceptors.request.use(
  (config) => {
    // Check if the data is an instance of FormData
    if (config.data instanceof FormData) {
      // Don't set Content-Type header for FormData (axios will set it automatically)
      delete config.headers["Content-Type"];
    } else {
      // Set Content-Type to application/json for JSON data
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor (to handle token refresh)
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    // Handle Access Token Expiry (401)
    if (error.response && error.response.status === 401) {
      isRefreshing = true;

      try {
        // Call the refresh endpoint (cookies automatically included)
        await api.post("/refreshAccessToken");

        isRefreshing = false;

        // Retry the original request (originalRequest will be available)
        return api(error.config);
      } catch (refreshError) {
        isRefreshing = false;

        if (refreshError.response && refreshError.response.status === 403) {
          // Dynamically import store to avoid early access before initialization
          const { store } = await import("../src/app/store");
          const dispatch = store.dispatch;

          dispatch(handleSessionExpiry()); // Show session expired dialog or redirect // Show session expired dialog or redirect
        }

        return Promise.reject(refreshError); // Reject with the refresh error
      }
    }

    // Handle Refresh Token Expiry (403)
    if (error.response && error.response.status === 403) {
      if (!isSessionExpired) {
        // Dynamically import store to avoid early access before initialization
        const { store } = await import("../src/app/store");
        const dispatch = store.dispatch;

        dispatch(handleSessionExpiry()); // Show session expired dialog or redirect
        return Promise.reject(error);
      }
      return Promise.reject(error); // Reject with the 403 error
    }

    return Promise.reject(error); // Pass other errors through
  }
);

export default api;
