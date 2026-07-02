import axios from 'axios';

// created base url and logic so that not have to give me server url everytime in api calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://memolink-js1f.onrender.com',
  withCredentials: true,
});


// Inject JWT Bearer token from localStorage on every request
//  adds authorisation header to the req if the token is found in local storage 

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memolink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler — maps backend ApiError/response shape

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('memolink_token');
      localStorage.removeItem('memolink_user');
      const path = window.location.pathname;
      if (path !== '/signin' && path !== '/signup' && path !== '/') {
        window.location.href = '/signin';
      }
    }
    
    const message = err?.response?.data?.message ?? 'An unexpected error occurred.';
    return Promise.reject({ status: err?.response?.status, message });
  }
);

export default api;
