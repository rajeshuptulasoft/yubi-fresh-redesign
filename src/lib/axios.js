import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://www.yubi.co.in/api/';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const yubiUser = localStorage.getItem('yubiUser');
    if (yubiUser) {
      try {
        const user = JSON.parse(yubiUser);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to appropriate login page
      const yubiUser = localStorage.getItem('yubiUser');
      localStorage.removeItem('yubiUser');
      
      // Redirect to appropriate login page based on user role
      if (yubiUser) {
        try {
          const user = JSON.parse(yubiUser);
          if (user.role === 'admin') {
            window.location.href = '/admin';
          } else if (user.role === 'delivery') {
            window.location.href = '/delivery-partner';
          } else {
            window.location.href = '/auth';
          }
        } catch (e) {
          window.location.href = '/auth';
        }
      } else {
        window.location.href = '/auth';
      }
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;

// Utility function for GET requests
export const apiGet = (endpoint, config = {}) => {
  return axiosInstance.get(endpoint, config);
};

// Utility function for POST requests
export const apiPost = (endpoint, data = {}, config = {}) => {
  return axiosInstance.post(endpoint, data, config);
};

// Utility function for PUT requests
export const apiPut = (endpoint, data = {}, config = {}) => {
  return axiosInstance.put(endpoint, data, config);
};

// Utility function for PATCH requests
export const apiPatch = (endpoint, data = {}, config = {}) => {
  return axiosInstance.patch(endpoint, data, config);
};

// Utility function for DELETE requests
export const apiDelete = (endpoint, config = {}) => {
  return axiosInstance.delete(endpoint, config);
};
