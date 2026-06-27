import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { AlertTriangle, Clock, CheckCircle, XCircle, Activity, FolderOpen, ArrowRight } from "lucide-react";
import { getAllIncidents } from "../services/monitor.service";

function Incident() {
  const navigate = useNavigate();
  
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ACTIVE");

  useEffect(() => {
    const fetchAllIncidents = async () => {
      try {
        setLoading(true);
        const data = await getAllIncidents();
        setIncidents(data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load global incident data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllIncidents();
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    if (filter === "ACTIVE") return !incident.resolvedAt;
    if (filter === "RESOLVED") return !!incident.resolvedAt;
    return true;
  });

  const activeCount = incidents.filter(i => !i.resolvedAt).length;

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[92%] sm:w-[85%] md:w-[80%] max-w-6xl mx-auto pt-24 sm:pt-32 pb-24">

          {/* HEADER */}
          <section className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight flex items-center gap-3">
                <AlertTriangle
                  className={activeCount > 0 ? "text-red-500 animate-pulse" : "text-gray-500"}
                  size={26}
                />
                Incident Overview
              </h1>
            </div>

            {/* FILTER TABS — scrollable on very small screens */}
            <div className="flex bg-white/5 p-1 rounded-md border border-white/10 w-fit overflow-x-auto">
              <button
                onClick={() => setFilter("ACTIVE")}
                className={`px-3 sm:px-5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filter === "ACTIVE" ? "bg-red-500/10 text-red-400 shadow-lg" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilter("RESOLVED")}
                className={`px-3 sm:px-5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === "RESOLVED" ? "bg-blue-500/10 text-blue-400 shadow-lg" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Resolved
              </button>
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 sm:px-5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === "ALL" ? "bg-white/10 text-white shadow-lg" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                All Logs
              </button>
            </div>
          </section>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <XCircle className="text-red-400 shrink-0" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* INCIDENTS LIST */}
          <section>
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500" />
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="flex flex-col items-center text-center py-16 sm:py-24 bg-[rgba(255,255,255,0.01)] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
                {filter === "ACTIVE" ? (
                  <>
                    <CheckCircle size={44} className="text-blue-500/80 mb-4" />
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">All Systems Operational</h2>
                    <p className="text-[var(--muted)] text-sm max-w-sm mt-2">
                      There are currently no active alerts across any of your workspaces.
                    </p>
                  </>
                ) : (
                  <>
                    <FolderOpen size={44} className="text-gray-500/50 mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">No Records Found</h2>
                    <p className="text-[var(--muted)] text-sm max-w-sm mt-2">
                      There are no incidents matching this filter.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:gap-4">
                {filteredIncidents.map((incident) => {
                  const isActive = !incident.resolvedAt;
                  const monitorName = incident.monitor?.name || "Unknown Monitor";
                  const projectName = incident.monitor?.project?.name || "Unknown Project";

                  return (
                    <div
                      key={incident.id}
                      className={`relative bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border rounded-md p-4 sm:p-5 flex flex-col gap-4 shadow-lg transition-all ${
                        isActive ? "border-red-500/30 shadow-red-500/20" : "border-white/5"
                      }`}
                    >
                      {/* TOP ROW: icon + info */}
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 w-10 h-10 flex items-center justify-center shrink-0 ${
                          isActive ? "text-red-500" : "text-[var(--muted)]"
                        }`}>
                          {isActive ? <AlertTriangle size={22} /> : <CheckCircle size={22} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Breadcrumb */}
                          <div className="flex items-center gap-1.5 sm:gap-3 mb-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1 shrink-0">
                              <FolderOpen size={13} /> {projectName}
                            </span>
                            <ArrowRight size={10} className="text-gray-500 shrink-0" />
                            <span className="flex items-center gap-1 text-blue-400 truncate">
                              <Activity size={12} /> {monitorName}
                            </span>
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border-none ${
                              isActive ? "text-red-400 animate-pulse" : "text-blue-400"
                            }`}>
                              {isActive ? "Active Alert" : "Resolved"}
                            </span>
                            {incident.statusCode && (
                              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-white/5 text-[var(--muted)] border border-white/10">
                                HTTP {incident.statusCode}
                              </span>
                            )}
                          </div>

                          <h3 className="text-white font-semibold text-base sm:text-xl mb-1 truncate">
                            {incident.errorType || "Connection Failure"}
                          </h3>
                          <p className="text-[var(--muted)] text-xs sm:text-sm line-clamp-2">
                            {incident.errorMessage || "The monitor failed to receive a successful response from the target endpoint."}
                          </p>
                        </div>
                      </div>

                      {/* BOTTOM ROW: timestamps + action */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-white/5">

                        {/* Timestamps */}
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={13} />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Started</span>
                              <span>
                                {incident.createdAt
                                  ? new Date(incident.createdAt).toLocaleString()
                                  : incident.startedAt
                                    ? new Date(incident.startedAt).toLocaleString()
                                    : "Date Unavailable"}
                              </span>
                            </div>
                          </div>

                          {!isActive && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <CheckCircle size={13} className="text-gray-400" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Resolved</span>
                                <span>{new Date(incident.resolvedAt).toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action button */}
                        <button
                          onClick={() => navigate(`/projects/${incident.monitor?.projectId}`)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-md transition-colors border border-white/10 flex items-center gap-2 w-fit"
                        >
                          Workspace <ArrowRight size={11} className="text-gray-300" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </main>
      </PageWrapper>
    </Layout>
  );
}

export default Incident;