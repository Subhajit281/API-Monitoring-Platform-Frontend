import api from "./api";

/**
 * Fetches compiled runtime stats counters and the authenticated project grid matrix.
 * API Endpoint: GET /dashboard
 */
export const getDashboardOverview = async () => {
  const response = await api.get("/dashboard/overview");
  return response.data.data;
};