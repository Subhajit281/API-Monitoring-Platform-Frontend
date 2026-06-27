import api from "./api";

/**
 * UPFLOW MONITOR SERVICE
 * Manages all endpoint integrations for synthetic monitor tasks.
 */

export const createMonitor = async (projectId, monitorData) => {
  const response = await api.post(`/projects/${projectId}/monitors`, monitorData);
  return response.data.data;
};

export const getMonitors = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/monitors`);
  return response.data.data;
};

export const getMonitorById = async (monitorId) => {
  const response = await api.get(`/monitors/${monitorId}`);
  return response.data.data;
};

export const updateMonitor = async (monitorId, updateData) => {
  const response = await api.patch(`/monitors/${monitorId}`, updateData);
  return response.data;
};

export const deleteMonitor = async (monitorId) => {
  const response = await api.delete(`/monitors/${monitorId}`);
  return response.data.data;
};

export const getMonitorResults = async (monitorId) => {
  const response = await api.get(`/monitors/${monitorId}/results`);
  return response.data.data;
};

export const getMonitorStats = async (monitorId) => {
  const response = await api.get(`/${monitorId}/stats`);
  return response.data.data;
};


export const getMonitorAlertsPageData = async (monitorId) => {
  const [monitorRes, incidentsRes] = await Promise.all([
    api.get(`/monitors/${monitorId}`),
    api.get(`/incidents?monitorId=${monitorId}`)
  ]);

  
  return {
    monitor: monitorRes.data.data,
    incidents: incidentsRes.data.data
  };
};

export const getAllIncidents = async () => {
  const response = await api.get('/incidents');
  return response.data.data;
};