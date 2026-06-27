import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { AlertTriangle, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { getMonitorAlertsPageData } from "../services/monitor.service";

function MonitorAlerts() {
  const { projectId, monitorId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({ monitor: null, incidents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const result = await getMonitorAlertsPageData(monitorId);
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load alerts.");
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, [projectId, monitorId]);

  return (
    <Layout>
      <PageWrapper>
        <main className="w-full max-w-5xl mx-auto pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <section className="mb-8 sm:mb-10">
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors mb-5 sm:mb-6 text-sm font-medium"
            >
              <ArrowLeft size={15} />
              Back to Monitors
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight mb-1.5 sm:mb-2">
                  Incident Log
                </h1>
                <p className="text-[var(--muted)] text-sm flex flex-wrap items-center gap-1">
                  Viewing alert history for
                  <span className="font-semibold text-white">
                    {data.monitor?.name || "Loading..."}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {error && (
            <div className="mb-6 sm:mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <XCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* INCIDENTS LIST */}
          <section>
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500" />
              </div>
            ) : data.incidents?.length === 0 ? (
              <div className="flex flex-col items-center text-center py-16 sm:py-20 bg-[rgba(255,255,255,0.01)] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
                <CheckCircle size={44} className="text-emerald-500/80 mb-4" />
                <h2 className="text-lg sm:text-xl font-bold text-white">No Incidents Found</h2>
                <p className="text-[var(--muted)] text-sm max-w-xs sm:max-w-sm mt-2">
                  This monitor has a perfect track record. No downtime or anomalies have been recorded yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:gap-4">
                {data.incidents.map((incident) => {
                  const isActive = !incident.resolvedAt;

                  return (
                    <div
                      key={incident.id}
                      className={`relative bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border rounded-md p-4 sm:p-5 flex flex-col gap-4 shadow-lg transition-all ${
                        isActive ? "border-red-500/30 shadow-red-500/20" : "border-white/5"
                      }`}
                    >
                      {/* TOP ROW: icon + status + error info */}
                      <div className="flex items-start gap-3 sm:gap-5">
                        <div className={`mt-0.5 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 ${isActive ? "text-red-500" : "text-[var(--muted)]"}`}>
                          {isActive ? <AlertTriangle size={22} /> : <CheckCircle size={22} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isActive ? "text-red-400 animate-pulse" : "text-blue-400"}`}>
                              {isActive ? "Active Alert" : "Resolved"}
                            </span>
                            {incident.statusCode && (
                              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-white/5 text-[var(--muted)] border border-white/10">
                                HTTP {incident.statusCode}
                              </span>
                            )}
                          </div>

                          <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                            {incident.errorType || "Connection Failure"}
                          </h3>

                          <p className="text-[var(--muted)] text-xs sm:text-sm line-clamp-2">
                            {incident.errorMessage || "The monitor failed to receive a successful response from the target endpoint."}
                          </p>
                        </div>
                      </div>

                      {/* BOTTOM ROW: timestamps — horizontal on sm+, stacked on xs */}
                      <div className="flex xs:flex-row gap-3 sm:gap-6 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={13} className="shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Started</span>
                            <span className="mt-0.5">
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
                            <CheckCircle size={13} className="text-gray-400 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Resolved</span>
                              <span className="mt-0.5">{new Date(incident.resolvedAt).toLocaleString()}</span>
                            </div>
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
    </Layout>
  );
}

export default MonitorAlerts;