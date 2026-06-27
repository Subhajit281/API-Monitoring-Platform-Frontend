import api from "./api"; // Your configured axios instance with interceptors

export const getProfileAnalytics = async () => {
  const response = await api.get("/profile/analytics");
  return response.data;
};