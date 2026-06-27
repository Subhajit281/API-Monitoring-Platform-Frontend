import api from "./api";

export const createProject = async (projectData) => {
  // Hits: http://localhost:5000/api/v1/projects
  const response = await api.post("/projects", projectData);
  return response.data.data;
};

export const getProjectById = async (projectId) => {
  // Hits: http://localhost:5000/api/v1/projects/:projectId
  const response = await api.get(`/projects/${projectId}`);
  return response.data.data;
};

export const getProjects = async () => {
  // Hits: http://localhost:5000/api/v1/projects
  const response = await api.get("/projects");
  return response.data.data;
};

export const deleteProject = async (projectId) => {
  // Hits: http://localhost:5000/api/v1/projects/:projectId
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

export const getDashboardOverview = async () => {
  // Hits: http://localhost:5000/api/v1/dashboard/overview
  const response = await api.get("/dashboard/overview"); 
  return response.data.data;
};