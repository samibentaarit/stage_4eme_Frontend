import axios from 'axios';

// Create an Axios instance
const apiService = axios.create({
  baseURL: 'http://localhost:8080/', // Replace with your backend URL
  withCredentials: true, // Ensures cookies are sent with every request
});

// Intercept requests to attach necessary headers or perform any preprocessing
apiService.interceptors.request.use(
  (config) => {
    // If additional headers are needed, add them here
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

// Intercept responses to handle refresh token flow
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If access token has expired and it's not a retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token
        await apiService.post('/auth/api/auth/refreshtoken');

        // Retry the original request with the new token
        return apiService(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        return Promise.reject(new Error(refreshError));
      }
    }

    // If the server responds with 403, redirect to /login page
    if (error.response && error.response.status === 403) {
      window.location.href = '/login';
    }

    return Promise.reject(new Error(error));
  }
);

export default apiService;