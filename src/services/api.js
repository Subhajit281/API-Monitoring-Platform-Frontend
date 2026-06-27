import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Request Interceptor to automatically attach JWT to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// USER & PROFILE API CALLS
// ==========================================

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile'); 
  return response.data.data;
};

export const updateUserProfile = async (updateData) => {
  const response = await api.patch('/auth/update', updateData);
  return response.data.data;
};

export const changeUserPassword = async (passwordData) => {
  const response = await api.patch('/auth/change-password', passwordData);
  return response.data;
};

// ==========================================
// TELEMETRY & PROJECT API CALLS
// ==========================================

// THIS IS THE NEW MISSING FUNCTION
export const getProjectOverview = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/overview`);
  return response.data;
};

export default api;