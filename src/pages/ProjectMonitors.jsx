import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from "recharts";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { getProjectById } from "../services/project.service";
import { getMonitors, getMonitorStats, getMonitorResults, updateMonitor, deleteMonitor } from "../services/monitor.service";
import { Activity, AlertTriangle, Clock, TrendingUp, ExternalLink, X, Trash2 } from "lucide-react";

function ProjectMonitors() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [monitorsData, setMonitorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingMonitor, setEditingMonitor] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", method: "", expectedStatus: 200, interval: 60 });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const projectContext = await getProjectById(projectId);
      setProject(projectContext);
      const monitorsList = await getMonitors(projectId);
      const enrichedMonitors = await Promise.all(
        monitorsList.map(async (monitor) => {
          try {
            const [stats, results] = await Promise.all([getMonitorStats(monitor.id), getMonitorResults(monitor.id)]);
            const safeResults = Array.isArray(results) ? results : [];
            const chartData = safeResults.slice(0, 30).reverse().map((res, index) => ({
              name: `#${index + 1}`,
              responseTime: res?.responseTime || 0,
              success: res?.success !== undefined ? res.success : true
            }));
            return { ...monitor, stats, chartData };
          } catch (err) {
            console.error(`Error loading telemetry for monitor ${monitor.id}:`, err);
            return { ...monitor, stats: { uptimePercentage: "0.00", incidentCount: 0 }, chartData: [] };
          }
        })
      );
      setMonitorsData(enrichedMonitors);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load project monitor dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (projectId) fetchAllData(); }, [projectId]);

  const RenderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;
    const isAnomaly = payload.responseTime >= 8000 || !payload.success;
    return <circle cx={cx} cy={cy} r={2.5} fill={isAnomaly ? "#fd271c" : "#0e90fa"} stroke={isAnomaly ? "#dd0b00" : "#9bc9ee"} strokeWidth={0.5} />;
  };

  const openEditModal = (monitor) => {
    setEditingMonitor(monitor);
    setEditForm({ name: monitor.name, method: monitor.method, expectedStatus: monitor.expectedStatus, interval: monitor.interval });
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      await updateMonitor(editingMonitor.id, { name: editForm.name, method: editForm.method, expectedStatus: parseInt(editForm.expectedStatus), interval: parseInt(editForm.interval) });
      setEditingMonitor(null);
      await fetchAllData();
    } catch (err) {
      setEditError(err?.response?.data?.message || "Failed to update monitor.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSubmit = async (monitorId) => {
    setIsDeleting(true);
    try {
      await deleteMonitor(monitorId);
      setDeleteConfirmId(null);
      await fetchAllData();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete monitor.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[95%] sm:w-full max-w-7xl mx-auto pt-22 sm:pt-28 lg:pt-32 pb-12 sm:pb-24 px-3 sm:px-6 lg:px-8">

          {/* HEADER */}
          <section className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.35em] text-blue-400 text-xs font-bold mb-3 sm:mb-6">Project Control Unit</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white tracking-tight">
                {project ? `${project.name} Monitors` : "Loading Workspace..."}
              </h1>
            </div>
            <button
              onClick={() => navigate(`/projects/${projectId}/monitors/create`)}
              className="self-start sm:self-auto px-4 h-9 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all  shadow-blue-500/10 text-xs sm:text-sm whitespace-nowrap"
            >
              + Add Monitor
            </button>
          </section>

          {error && (
            <div className="mb-6 sm:mb-8 p-4 rounded-md bg-red-500/20 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <section>
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : monitorsData.length === 0 ? (
              <div className="flex flex-col items-center text-center py-16 sm:py-20 border-none p-6 sm:p-8">
                <Activity size={40} className="text-amber-400/80 mb-4 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-bold text-white">No Monitors Configured</h2>
                <p className="text-[var(--muted)] text-sm max-w-xs mt-2 mb-6">
                  This project container does not have synthetic task runtimes running yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-8">
                {monitorsData.map((monitor) => (
                  <div key={monitor.id} className="bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/5 rounded-md p-5 sm:p-8 flex flex-col gap-6 shadow-m transition-all duration-300 hover:border-white/10">

                    {/* TOP SECTION: info + stats */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">

                      {/* Monitor identity */}
                      <div className="flex flex-col gap-3 sm:w-56 lg:w-64 shrink-0">
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${monitor.isActive ? "bg-blue-600 animate-pulse" : "bg-gray-500"}`} />
                            <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight truncate">{monitor.name}</h2>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-md font-mono border border-white/5 uppercase font-bold">
                              {monitor.method}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">Interval: {monitor.interval}s</span>
                          </div>
                          <a href={monitor.url} target="_blank" rel="noreferrer"
                            className="text-[var(--muted)] text-xs flex items-center gap-1.5 hover:text-blue-400 transition-colors w-fit break-all line-clamp-2">
                            {monitor.url}
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                          <div className="bg-white/[0.02] border-b border-r border-gray-500 rounded-md p-3 text-left">
                            <div className="flex items-center gap-1.5 mb-1.5 text-blue-400">
                              <TrendingUp size={14} />
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Uptime</p>
                            </div>
                            <p className="text-base sm:text-lg font-semibold text-white">{monitor.stats?.uptimePercentage}%</p>
                          </div>
                          <div className="bg-white/[0.02] border-b border-r border-gray-500 rounded-md p-3 text-left">
                            <div className="flex items-center gap-1.5 mb-1.5 text-blue-400">
                              <Clock size={14} />
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Latency</p>
                            </div>
                            <p className="text-base sm:text-lg font-semibold text-white truncate">{monitor.stats?.averageResponseTime}ms</p>
                          </div>
                          <div className={`col-span-2 border-none rounded-md p-3 text-left flex items-center justify-between ${monitor.stats?.incidentCount > 0 ? "bg-red-500/20" : "bg-white/[0.02]"}`}>
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={15} className={monitor.stats?.incidentCount > 0 ? "text-red-500 animate-pulse" : "text-[var(--muted)]"} />
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Incidents</p>
                            </div>
                            <p className="text-base font-semibold text-white">{monitor.stats?.incidentCount}</p>
                          </div>
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="flex-1 bg-black/20 border border-white/5 rounded-md p-4 sm:p-6 flex flex-col min-w-0">
                        <span className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase mb-4 block">
                          Latency History (Recent 30 Checks)
                        </span>
                        <div className="w-full h-48 sm:h-[220px] lg:h-[260px]">
                          {monitor.chartData.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 italic">
                              Awaiting execution payloads...
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={monitor.chartData} margin={{ top: 10, right: 8, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                                <XAxis dataKey="name" stroke="#718096" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} angle={-35} textAnchor="end" />
                                <YAxis stroke="#718096" fontSize={10} tickLine={false} axisLine={false} tickMargin={6} domain={[0, 'dataMax + 1000']} tickFormatter={(v) => `${v}ms`} width={48} />
                                <Tooltip
                                  contentStyle={{ backgroundColor: "#1A2740", borderColor: "rgba(255,255,255,0.1)", borderRadius: "6px", padding: "7px" }}
                                  labelStyle={{ color: "#bac0cb", marginBottom: "4px" }}
                                  itemStyle={{ color: "#fff", fontSize: "13px", fontWeight: "bold" }}
                                  formatter={(value) => [`${value} ms`, "Latency"]}
                                />
                                <ReferenceLine y={8000} stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} opacity={0.5}
                                  label={{ position: 'top', value: 'Timeout', fill: '#EF4444', fontSize: 10 }} />
                                <Line type="monotone" dataKey="responseTime" stroke="#9bd0fc" strokeWidth={1.5} dot={<RenderCustomDot />} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} isAnimationActive />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION FOOTER — horizontal on all sizes */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                      <button
                        type="button" onClick={() => openEditModal(monitor)}
                        className="flex-1 sm:flex-none px-2 py-2.5 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-white/20 text-white rounded-md font-semibold text-xs sm:text-sm transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${projectId}/monitors/${monitor.id}/alerts`)}
                        className="flex sm:flex-none px-4 py-2.5 bg-[rgba(255,255,255,0.02)] border border-red-500/20 text-red-500 font-semibold rounded-md transition-all text-xs sm:text-sm flex items-center justify-center gap-1"
                      >
                        <AlertTriangle size={13} /> View Alerts
                      </button>
                      <button
                        type="button" onClick={() => setDeleteConfirmId(monitor.id)}
                        className="px-4 py-2.5 text-gray-400 hover:text-red-500 rounded-md font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </PageWrapper>

      {/* EDIT MODAL */}
      {editingMonitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111928] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-lg sm:text-xl font-bold text-white">Edit Monitor</h3>
              <button onClick={() => setEditingMonitor(null)} className="text-[var(--muted)] hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
              {editError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{editError}</div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Monitor Name</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Method</label>
                  <select value={editForm.method} onChange={(e) => setEditForm({...editForm, method: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm">
                    {["GET","POST","PUT","PATCH","DELETE"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Status Code</label>
                  <input type="number" required value={editForm.expectedStatus} onChange={(e) => setEditForm({...editForm, expectedStatus: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Check Interval</label>
                <select value={editForm.interval} onChange={(e) => setEditForm({...editForm, interval: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-sm">
                  <option value="30">30 Seconds</option>
                  <option value="60">1 Minute</option>
                  <option value="300">5 Minutes</option>
                  <option value="900">15 Minutes</option>
                  <option value="1800">30 Minutes</option>
                </select>
              </div>
              <div className="pt-3 sm:pt-4 border-t border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingMonitor(null)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm text-[var(--muted)] hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading}
                  className="px-5 sm:px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50">
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111928] border border-white/10 rounded-lg w-[90%] max-w-sm shadow-xl p-6 sm:p-8 text-center">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-5 sm:mb-6 border-none ">
              <Trash2 size={26} className="text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Delete Monitor?</h3>
            <p className="text-[var(--muted)] text-sm mb-6 sm:mb-8 leading-relaxed">
              This action cannot be undone. All associated check history, telemetry, and incident data will be permanently erased.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3 rounded-lg font-bold text-sm text-[var(--muted)] hover:text-white transition-colors bg-white/5 hover:bg-white/10">
                Cancel
              </button>
              <button type="button" onClick={() => handleDeleteSubmit(deleteConfirmId)} disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/20">
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ProjectMonitors;