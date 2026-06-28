import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { getDashboardOverview, deleteProject } from "../services/project.service";
import { Activity, AlertTriangle, FolderOpen, Trash2, Plus } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: {}, projects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const overview = await getDashboardOverview();
      setData(overview);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load Projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteSubmit = async (projectId) => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      setDeleteConfirmId(null);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getProjectStatus = (project) => {
    if (!project.monitorCount || project.monitorCount === 0) return "Draft";
    if (project.activeIncidents > 0) return "Degraded";
    return "Active";
  };

  const statusStyle = (status) => {
    if (status === "Active")   return " text-blue-500 border-none";
    if (status === "Degraded") return " text-red-400 border-none";
    return " text-[#fba628] border-none";
  };

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[84%] sm:w-[90%] md:w-[80%] max-w-7xl mx-auto pt-24 sm:pt-32 pb-24">

          {/* HEADER */}
          <section className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tight mb-2 sm:mb-4">
                Workspace Overview
              </h1>
              <p className="text-[var(--muted)] text-xs sm:text-sm max-w-xl sm:max-w-[400px]">
                Analyze active synthetic test scopes, service statuses, and operational alerts across infrastructures.
              </p>
            </div>
            <button
              onClick={() => navigate("/create-project")}
              className="
                px-2 sm:px-4
                h-8 sm:h-10
                bg-blue-600 hover:bg-blue-700
                text-white
                text-xs sm:text-sm
                font-semibold
                rounded-md
                transition-all
                shadow-lg shadow-blue-500/10
                flex items-center
                gap-1 sm:gap-2
                shrink-0
                self-start sm:self-auto
              "
            >
              <Plus size={18} />
              Create Project
            </button>
          </section>

          {error && (
            <div className="mb-8 p-4 border-none">
              <p className="text-red-400 text-base sm:text-lg font-medium">{error}</p>
            </div>
          )}

          {/* STATS ROW */}
          {!loading && (
            <section className="grid grid-cols-3 gap-2 sm:gap-4 mb-2">
              <div className="
                bg-[rgba(255,255,255,0.02)]
                backdrop-blur-lg
                border-b-2 border-r-2  border-gray-500/40
                rounded-lg
                px-2 py-3
                sm:p-5
                flex flex-col justify-center
                sm:flex-row sm:justify-between
                items-center sm:items-center
                shadow-xl
                min-h-[78px] sm:min-h-[120px]
              ">
                <div>
                  <p className="text-[10px] sm:text-[12px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">
                    Projects
                  </p>
                  <p className="text-xl sm:text-2xl font-medium text-white">{data.stats?.totalProjects || 0}</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center">
                  <FolderOpen className="text-gray-400" size={20} />
                </div>
              </div>

              <div className="
                bg-[rgba(255,255,255,0.02)]
                backdrop-blur-lg
                border-b-2 border-r-2 border-gray-500/40
                rounded-lg
                px-2 py-3
                sm:p-5
                flex flex-col justify-center
                sm:flex-row sm:justify-between
                items-center sm:items-center
                shadow-xl
                min-h-[78px] sm:min-h-[120px]
              ">
                <div>
                  <p className="text-[10px] sm:text-[12px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">
                    Monitors
                  </p>
                  <p className="text-xl sm:text-2xl font-medium text-white">{data.stats?.totalMonitors || 0}</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center">
                  <Activity className="text-gray-400" size={20} />
                </div>
              </div>

              <div className="
                bg-[rgba(255,255,255,0.02)]
                backdrop-blur-lg
                border-b-2 border-r-2 border-gray-500/40
                rounded-lg
                px-2 py-3
                sm:p-5
                flex flex-col justify-center
                sm:flex-row sm:justify-between
                items-center sm:items-center
                shadow-xl
                min-h-[78px] sm:min-h-[120px]
              ">
                <div>
                  <p className="text-[10px] sm:text-[12px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">
                    Incidents
                  </p>
                  <p className="text-xl sm:text-2xl font-medium text-white">{data.stats?.activeIncidents || 0}</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center">
                  <AlertTriangle
                    className={data.stats?.activeIncidents > 0 ? "text-red-500 animate-pulse" : "text-gray-400"}
                    size={20}
                  />
                </div>
              </div>
            </section>
          )}

          {/* PROJECTS GRID */}
          <section className="mt-2">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : data.projects?.length === 0 ? (
              <div className="flex flex-col items-center text-center py-16 sm:py-20 bg-[rgba(255,255,255,0.01)] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8">
                <FolderOpen size={36} className="text-blue-400/80 mb-4" />
                <h2 className="text-lg sm:text-xl font-bold text-white">No Projects Found</h2>
                <p className="text-[var(--muted)] text-sm max-w-xs mt-2 mb-6">
                  Create your first workspace to start monitoring your infrastructure.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {data.projects.map((project) => {
                  const status = getProjectStatus(project);
                  return (
                    <div
                      key={project.id}
                      className="bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/5 rounded-md p-5 sm:p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/10 group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[11px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase ${statusStyle(status)}`}>
                            {status}
                          </span>
                          <button
                            onClick={() => setDeleteConfirmId(project.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-2 line-clamp-1">
                          {project.name}
                        </h3>
                        <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[32px]">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-5 sm:mt-6 pt-4 border-t border-white/5 flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-center justify-between text-[13px] text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Activity size={14} className="text-blue-300" />
                            {project.monitorCount} monitor
                          </span>
                          <span className="text-xs">{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>

                        {project.monitorCount === 0 ? (
                          <button
                            onClick={() => navigate(`/projects/${project.id}/monitors/create`)}
                            className="w-full sm:w-[40%] py-2 bg-[#D97706] hover:bg-[#de8b16] text-black font-semibold rounded-md transition-all text-[13px]"
                          >
                            Create Monitor
                          </button>
                        ) : (
                          <div className="flex gap-1.5 sm:gap-2">
                            <button
                              onClick={() => navigate(`/projects/${project.id}`)}
                              className="flex-1 py-2 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border-b border-r border-gray-600 text-white font-semibold rounded-md transition-all text-[12px] sm:text-[13px] flex items-center justify-center gap-1 sm:gap-1.5"
                            >
                              <FolderOpen size={13} className="text-violet-400" />
                              <span className="hidden xs:inline">View</span>
                              <span className="xs:hidden">View</span>
                            </button>
                            <button
                              onClick={() => navigate(`/projects/${project.id}/monitors`)}
                              className="flex-1 py-2 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border-b border-r border-gray-600 text-white font-semibold rounded-md transition-all text-[12px] sm:text-[13px] flex items-center justify-center gap-1 sm:gap-1.5"
                            >
                              <Activity size={13} className="text-blue-400" />
                              Monitors
                            </button>
                            <button
                              onClick={() => navigate(`/projects/${project.id}/monitors/create`)}
                              className="flex-1 py-2 border-b border-r border-gray-600 text-blue-400 font-semibold rounded-md transition-all text-[12px] sm:text-[14px] flex items-center justify-center gap-1 sm:gap-1.5"
                            >
                              <Plus size={13} />
                              Create
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </main>
      </PageWrapper>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111928] border border-white/10 rounded-lg w-full max-w-sm shadow-2xl p-6 sm:p-8 text-center">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16  flex items-center justify-center mb-5 sm:mb-6 border-none">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Delete Workspace?</h3>
            <p className="text-[var(--muted)] text-sm mb-6 sm:mb-8 leading-relaxed">
              This action cannot be undone. The project and{" "}
              <strong>all its associated monitors, telemetry, and incident data</strong> will be permanently erased.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 sm:px-5 py-3 rounded-lg font-bold text-sm text-[var(--muted)] hover:text-white transition-colors bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSubmit(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 px-4 sm:px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 "
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;