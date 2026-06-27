import api from "./api";

export const getProjectOverview =
async (
    projectId,
    range = "24H"
) => {

  const response =
  await api.get(
    `/projects/${projectId}/overview?range=${range}`
  );

  return response.data.data;
};