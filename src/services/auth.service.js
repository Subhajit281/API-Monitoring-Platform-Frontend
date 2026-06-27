import api from "./api";

// API Endpoints
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};


export const requestOtp = async (userData) => {
  const response = await api.post("/auth/request-otp", userData);
  return response.data;
};

export const verifyOtp = async (userData) => {
  const response = await api.post("/auth/verify-otp", userData);
  return response.data;
};


export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch("/auth/update", profileData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/auth/delete");
  localStorage.clear(); // Wipes all state data to secure the client context
  return response.data;
};

// Local Session Actions
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

// Production Auth State Helpers
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const sendRegistrationOtp = async (data) => {
  const response = await api.post("/auth/register/send-otp", data);
  return response.data;
};

export const verifyRegistrationOtp = async (data) => {
  const response = await api.post("/auth/register/verify-otp", data);
  return response.data;
};