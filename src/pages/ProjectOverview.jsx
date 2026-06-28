import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Activity, AlertTriangle, Plus, ArrowRight, Clock, TrendingUp,
  Shield, ChevronRight,
} from "lucide-react";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { getProjectOverview } from "../services/telemetry.service";
import api from "../services/api";

/* ─── helpers ─── */
const fmt = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`);
const fmtTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

/* ─── status badge ─── */
const StatusBadge = ({ status }) => {
  const cfg = {
    OPERATIONAL: "text-blue-400",
    DEGRADED:    "text-yellow-400",
    DOWN:        "text-red-400",
    UNKNOWN:     "text-gray-400",
  };
  const dot = {
    OPERATIONAL: "bg-blue-400",
    DEGRADED:    "bg-yellow-400 animate-pulse",
    DOWN:        "bg-red-400 animate-pulse",
    UNKNOWN:     "bg-gray-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase ${cfg[status] ?? cfg.UNKNOWN}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] ?? dot.UNKNOWN}`} />
      {status}
    </span>
  );
};

/* ─── chart tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#254b9c] border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl">
      <p className="text-[10px] text-gray-400 mb-1">{fmtDate(label)}</p>
      <p className="text-white font-bold text-sm">{fmt(payload[0].value)}</p>
    </div>
  );
};

/* ─── sparkline ─── */
const Sparkline = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={32}>
    <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#2f5ba1" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="responseTime" stroke="#3b82f6" strokeWidth={1.5} fill="url(#sparkGrad)" dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

/* ════════════════════════════════════════
   Main Component
════════════════════════════════════════ */
export default function ProjectOverview() {
  const { projectId } = useParams();
  const navigate      = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [range,    setRange]    = useState("24H");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProjectOverview(projectId, range);
        setOverview(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load project overview.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId, range]);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        let sessionId = sessionStorage.getItem("upflow-session-id");
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          sessionStorage.setItem("upflow-session-id", sessionId);
        }
        await api.post(`/projects/${projectId}/visit`, { sessionId });
      } catch (error) {
        console.error("Visit tracking failed", error);
      }
    };
    recordVisit();
  }, [projectId]);

  const deriveStatus = () => {
    if (!overview) return "DRAFT";
    const { summary } = overview;
    if (!summary?.totalMonitors) return "DRAFT";
    if (summary?.activeIncidents > 0) return "DEGRADED";
    return "OPERATIONAL";
  };

  if (loading) return (
    <Layout><PageWrapper>
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    </PageWrapper></Layout>
  );

  if (error) return (
    <Layout><PageWrapper>
      <div className="w-full max-w-4xl mx-auto pt-24 sm:pt-32 px-4 sm:px-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    </PageWrapper></Layout>
  );

  const { project, summary, monitorHealth = [], slowestMonitors = [], recentIncidents = [], latencyTrend = [] } = overview;
  const projectStatus = deriveStatus();

  const stats = [
    { label: "Total APIs",          value: summary?.totalMonitors ?? 0,                                              icon: <Activity size={17} className="text-white" />,    accent: "blue" },
    { label: "Avg. Response Time",  value: summary?.rangeAverageResponseTime ? fmt(summary.rangeAverageResponseTime) : "—", icon: <Clock size={17} className="text-white" />,       accent: "violet", sparkline: true },
    { label: "Uptime (24h)",        value: summary?.uptimePercentage != null ? `${Number(summary.uptimePercentage).toFixed(2)}%` : "—", icon: <TrendingUp size={17} className="text-white" />, accent: "emerald" },
    { label: "Active Incidents",    value: summary?.activeIncidents ?? 0,                                             icon: <AlertTriangle size={17} className={summary?.activeIncidents > 0 ? "text-red-400 animate-pulse" : "text-white"} />, accent: summary?.activeIncidents > 0 ? "red" : "gray" },
  ];

  const chartData = latencyTrend.map((p) => ({
    checkedAt:    p.checkedAt,
    responseTime: Number(p.responseTime ?? p.avgResponseTime ?? 0),
  }));

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[94%] sm:w-full max-w-7xl mx-auto pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-24 px-3 sm:px-6 lg:px-8 space-y-2 sm:space-y-4">

          {/* ═══ HEADER ═══ */}
          <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight">
                  {project?.name ?? "Project"}
                </h1>
                <StatusBadge status={projectStatus} />
              </div>
              <p className="text-[var(--muted)] text-xs sm:text-base max-w-xl mb-4">
                {project?.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate(`/projects/${projectId}/monitors`)}
                className="px-3 sm:px-4 h-8 sm:h-10 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-white/10 text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all"
              >
                <Activity size={14} /> <span className="hidden sm:inline">View</span> Monitors
              </button>
              <button
                onClick={() => navigate(`/projects/${projectId}/monitors/create`)}
                className="px-3 sm:px-4 h-8 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all"
              >
                <Plus size={14} /> <span className="hidden sm:inline">Add</span> Monitor
              </button>
            </div>
          </section>

          {/* ═══ STAT CARDS ═══ */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {stats.map((s) => (
              <div key={s.label}
               className="
                bg-[rgba(255,255,255,0.02)]
                backdrop-blur-lg
                border border-white/5
                rounded-lg
                px-3 py-3
                sm:p-5
                flex flex-col
                gap-2
                sm:gap-3
                hover:border-white/10
                transition-all
                duration-300
              "
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] sm:text-[11px] font-bold tracking-wide sm:tracking-widest text-[var(--muted)] uppercase text-center sm:text-left">
                    {s.label}
                  </p>
                  <div className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center shrink-0">
                    {s.icon}
                  </div>
                </div>
                <p className="text-md sm:text-xl lg:text-[22px] font-semibold text-white leading-none text-left">
                  {s.value}
                </p>
                {s.sparkline && chartData.length > 1 && (
                  <div className="-mx-1 pb-2"><Sparkline data={chartData} /></div>
                )}
              </div>
            ))}
          </section>

          {/* ═══ MAIN GRID: Chart + sidebar ═══ */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">

            {/* Response Time Chart */}
            <div className="lg:col-span-2 bg-[rgba(255,255,255,0.02)] backdrop-blur-lg border border-white/5 rounded-md p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-14">
                <h2 className="text-xs sm:text-sm font-semibold text-white">Response Time</h2>
                {/* Range selector — scrollable on very small screens */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-[rgba(255,255,255,0.04)] border border-white/5 rounded-md p-1 overflow-x-auto w-fit self-start sm:self-auto">
                  {["1H","6H","24H","7D","30D"].map((r) => (
                    <button key={r} onClick={() => setRange(r)}
                      className={`px-2 sm:px-2.5 py-1 sm:py-1 text-[10px] sm:text-[11px] font-bold rounded-sm transition-all whitespace-nowrap ${
                        range === r
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >{r}</button>
                  ))}
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="h-32 sm:h-40 flex items-center justify-center text-[var(--muted)] text-sm">
                  No latency data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="rtGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(145,134,134,0.04)" vertical={false} />
                    <XAxis dataKey="checkedAt" tickFormatter={fmtTime} tick={{ fontSize: 10, fill: "#9ea4b0" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `${v}ms`} tick={{ fontSize: 10, fill: "#9ea4b0" }} axisLine={false} tickLine={false} width={42} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="responseTime" stroke="#3b82f6" strokeWidth={1} fill="url(#rtGrad)" dot={false}
                      activeDot={{ r: 3, fill: "#919eb5", stroke: "#fff", strokeWidth: 1 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Right column: Slowest + Incidents — stacked */}
            <div className="flex flex-col gap-2 sm:gap-3">

              {/* Slowest APIs */}
              <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-lg border border-white/5 rounded-md p-3 sm:p-5 flex-1">

                <h2 className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-4">
                  Top Slowest APIs
                </h2>

                {slowestMonitors.length === 0 ? (
                  <p className="text-[var(--muted)] text-xs sm:text-sm">
                    No data available.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide sm:tracking-widest mb-2 px-1">
                      <span>API Name</span>
                      <span>Avg. Response</span>
                    </div>

                    <ul className="space-y-1">
                      {slowestMonitors.map((m, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between px-1 py-1 sm:py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                        >
                          <span className="text-[11px] sm:text-sm text-gray-300 truncate max-w-[62%] sm:max-w-[55%]">
                            {m.name}
                          </span>

                          <span className="text-[11px] sm:text-sm font-semibold text-amber-500 shrink-0">
                            {fmt(m.avgResponseTime ?? m.averageResponseTime ?? 0)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>



              {/* Recent Incidents */}
              <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-lg border border-white/5 rounded-md p-3 sm:p-5 flex-1">

                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h2 className="text-xs sm:text-sm font-bold text-white">
                      Recent Incidents
                    </h2>

                    <button
                      onClick={() => navigate("/incident")}
                      className="text-[11px] sm:text-[13px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
                    >
                      View all
                      <ArrowRight size={11} className="sm:w-3 sm:h-3" />
                    </button>
                  </div>

                  {recentIncidents.length === 0 ? (
                    <p className="text-[var(--muted)] text-xs sm:text-sm">
                      No recent incidents.
                    </p>
                  ) : (
                    <ul className="space-y-2 sm:space-y-3">
                      {recentIncidents.slice(0, 4).map((inc, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 sm:gap-3"
                        >
                          <div
                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                              inc.status === "OPEN"
                                ? "bg-red-400 animate-pulse"
                                : "bg-blue-500"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] sm:text-sm text-white font-semibold capitalize truncate">
                              {inc.monitorName ?? inc.name}
                            </p>

                            <p className="text-[9px] sm:text-[11px] text-gray-500 mt-0.5">
                              {fmtDate(inc.startedAt ?? inc.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 text-[9px] sm:text-[11px] mt-1 font-bold capitalize ${
                              inc.status === "open"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {inc.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            </div>
          </section>

          {/* ═══ ALL APIs TABLE + HEALTH ═══ */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">

            {/* APIs Table — horizontally scrollable on mobile */}
            <div className="lg:col-span-2 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/5 rounded-md overflow-hidden">
                <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold text-white">
                    All APIs
                  </h2>

                  <button
                    onClick={() => navigate(`/projects/${projectId}/monitors`)}
                    className="text-[11px] sm:text-[13px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
                  >
                    Manage
                    <ChevronRight size={11} className="sm:w-[13px] sm:h-[13px]" />
                  </button>
                </div>

                {monitorHealth.length === 0 ? (
                  <div className="px-4 sm:px-6 py-8 sm:py-10 text-center text-[var(--muted)] text-xs sm:text-sm">
                    No monitors found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[440px] sm:min-w-[460px]">
                      <thead>
                        <tr className="border-b border-white/5">
                          {["API Name", "Status", "Response Time", "Uptime (24h)", "Incidents"].map((h) => (
                            <th
                              key={h}
                              className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide sm:tracking-widest whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {monitorHealth.map((m, i) => (
                          <tr
                            key={i}
                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-3 sm:px-6 py-2.5 sm:py-3 text-gray-200 text-[11px] sm:text-[13px] truncate capitalize max-w-[120px] sm:max-w-[180px]">
                              {m.name}
                            </td>

                            <td className="px-3 sm:px-6 py-2.5 sm:py-3">
                              <StatusBadge status={m.status} />
                            </td>

                            <td className="px-3 sm:px-6 py-2.5 sm:py-3 text-gray-300 text-[11px] sm:text-[13px] font-semibold whitespace-nowrap">
                              {fmt(m.avgResponseTime ?? m.averageResponseTime ?? 0)}
                            </td>

                            <td className="px-3 sm:px-6 py-2.5 sm:py-3 text-blue-400 font-semibold text-[11px] sm:text-[13px] whitespace-nowrap">
                              {Number(m.uptimePercentage ?? 100).toFixed(2)}%
                            </td>

                            <td className="px-3 sm:px-6 py-2.5 sm:py-3 text-gray-400 text-[11px] sm:text-[13px] font-semibold whitespace-nowrap">
                              {m.incidents ?? 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            {/* API Health */}
            <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-white/5 rounded-md p-3 sm:p-5">
                  <div className="flex items-center justify-between mb-3 sm:mb-5">
                    <h2 className="text-xs sm:text-sm font-bold text-white">
                      API Health
                    </h2>

                    <Shield
                      size={12}
                      className="text-blue-400 sm:w-[14px] sm:h-[14px]"
                    />
                  </div>

                  {monitorHealth.length === 0 ? (
                    <p className="text-[var(--muted)] text-xs sm:text-sm">
                      No data yet.
                    </p>
                  ) : (
                    <ul className="space-y-2 sm:space-y-3">
                      {monitorHealth.map((m, i) => {
                        const uptime = Number(m.uptimePercentage ?? 100);
                        const healthy = uptime >= 99;

                        return (
                          <li key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] sm:text-sm text-gray-300 truncate capitalize max-w-[65%] sm:max-w-[60%]">
                                {m.name}
                              </span>

                              <span
                                className={`text-[11px] sm:text-xs font-bold ${
                                  healthy ? "text-blue-400" : "text-red-400"
                                }`}
                              >
                                {uptime.toFixed(2)}%
                              </span>
                            </div>

                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  healthy ? "bg-blue-600" : "bg-red-500"
                                }`}
                                style={{ width: `${Math.min(uptime, 100)}%` }}
                              />
                            </div>
                          </li>
                        );
                      })}

                      <li className="pt-2 border-t border-white/5">
                        <button
                          onClick={() => navigate(`/projects/${projectId}/monitors`)}
                          className="text-[11px] sm:text-[13px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                        >
                          View all APIs
                          <ArrowRight
                            size={10}
                            className="sm:w-[11px] sm:h-[11px]"
                          />
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
          </section>

        </main>
      </PageWrapper>
    </Layout>
  );
}