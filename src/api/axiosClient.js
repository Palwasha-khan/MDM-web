import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

export const rawAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Attach the access token to every outgoing request automatically
axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

 
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axiosClient.interceptors.response.use(
  (response) => response, // successful responses pass straight through
  async (error) => {
    const originalRequest = error.config;

    // Only attempt a refresh on a 401, and only once per request
    // (the _retry flag prevents an infinite loop if refresh itself fails)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already happening (triggered by another failed
      // request), just wait for it to finish instead of firing a second one
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeToRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        
        const { data } = await rawAxios.post("/auth/refresh-token");

        setAccessToken(data.accessToken);
        isRefreshing = false;
        onRefreshed(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest); // retry the original failed request
      } catch (refreshError) {
        isRefreshing = false;
        setAccessToken(null);  
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;