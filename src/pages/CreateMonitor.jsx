import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { getProjectById } from "../services/project.service";
import { createMonitor } from "../services/monitor.service";
import { ArrowRight, Plus, Minus } from "lucide-react";

function CreateMonitor() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [fetchedProjectName, setFetchedProjectName] = useState("Loading project...");
  const [monitorName, setMonitorName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [expectedStatus, setExpectedStatus] = useState(200);
  const [timeout, setTimeoutValue] = useState(5000);
  const [interval, setIntervalValue] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeoutOptions = [
    { label: "5 Seconds",  value: 5000 },
    { label: "6 Seconds",  value: 6000 },
    { label: "7 Seconds",  value: 7000 },
    { label: "8 Seconds",  value: 8000 },
    { label: "9 Seconds",  value: 9000 },
    { label: "10 Seconds", value: 10000 },
    { label: "15 Seconds", value: 15000 },
    { label: "30 Seconds", value: 30000 },
  ];

  const intervalOptions = [
    { label: "Every 30 Seconds",  value: 30 },
    { label: "Every 1 Minute",    value: 60 },
    { label: "Every 5 Minutes",   value: 300 },
    { label: "Every 15 Minutes",  value: 900 },
    { label: "Every 30 Minutes",  value: 1800 },
    { label: "Every 60 Minutes",  value: 3600 },
  ];

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const projectData = await getProjectById(projectId);
        setFetchedProjectName(projectData.name);
      } catch (err) {
        console.error(err);
        setFetchedProjectName("Failed to load project context");
        setError("Could not retrieve metadata for this project layout.");
      }
    })();
  }, [projectId]);

  const isValidURL = (string) => {
    try { new URL(string); return true; }
    // eslint-disable-next-line no-unused-vars
    catch (_) { return false; }
  };

  const handleStartMonitoring = async (e) => {
    e.preventDefault();
    setError("");

    if (!monitorName.trim()) { setError("Monitor Name is required"); return; }
    if (monitorName.trim().length < 3 || monitorName.trim().length > 100) {
      setError("Monitor name must be between 3 and 100 characters"); return;
    }
    if (!targetUrl.trim()) { setError("Target URL is required"); return; }
    if (!isValidURL(targetUrl.trim())) {
      setError("Please provide a valid target URL (e.g., https://example.com)"); return;
    }
    const statusNumber = parseInt(expectedStatus, 10);
    if (isNaN(statusNumber) || statusNumber < 100 || statusNumber > 599) {
      setError("Expected Status Code must be between 100 and 599"); return;
    }

    try {
      setLoading(true);
      await createMonitor(projectId, {
        name: monitorName.trim(),
        url: targetUrl.trim(),
        method,
        expectedStatus: statusNumber,
        timeout: parseInt(timeout, 10),
        interval: parseInt(interval, 10),
      });
      navigate("/projects");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to establish monitor instance.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-11 rounded-md bg-[rgba(255,255,255,0.03)] border border-transparent focus:border-blue-500 transition-all px-4 text-white outline-none text-sm";
  const selectCls = "w-full h-11 rounded-md bg-[rgba(255,255,255,0.03)] border border-transparent focus:border-blue-500 px-4 text-white outline-none cursor-pointer transition-all text-sm";
  const labelCls = "block text-white mb-2 font-medium text-sm";

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[90%] max-w-3xl mx-auto pt-20 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6">

          {/* HERO */}
          <section className="mb-10 sm:mb-14">
            <p className="uppercase tracking-[0.35em] text-blue-400 text-xs font-bold mb-3 sm:mb-6">
              Monitor Setup
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-tight">
              Create Synthetic Monitor.
            </h1>
            <p className="text-[var(--muted)] text-xs sm:text-lg max-w-2xl mt-3 sm:mt-4">
              Configure parameters to monitor uptime endpoints, alert on structural failure loops, and isolate target behaviors.
            </p>
          </section>

          {/* FORM */}
          <section>
            <motion.form
              onSubmit={handleStartMonitoring}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full bg-[rgba(76,67,67,0.03)] border-t-2 border-blue-500 backdrop-blur-xl rounded-lg p-4 sm:p-8 space-y-4 sm:space-y-6"
            >
              {error && (
                <div className="p-2.5 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              {/* Project */}
              <div>
                <label className={`${labelCls} text-xs sm:text-sm`}>Project</label>

                <input
                  type="text"
                  value={fetchedProjectName}
                  readOnly
                  disabled
                  className="w-full h-9 sm:h-11 rounded-md bg-[rgba(255,255,255,0.01)] border border-white/5 px-3 sm:px-4 text-gray-400 font-semibold cursor-not-allowed outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Monitor Name */}
              <div>
                <label className={`${labelCls} text-xs sm:text-sm`}>
                  Monitor Name
                </label>

                <input
                  type="text"
                  placeholder="eg: Portfolio API"
                  value={monitorName}
                  onChange={(e) => setMonitorName(e.target.value)}
                  disabled={loading}
                  className="w-full h-9 sm:h-11 rounded-md bg-[rgba(255,255,255,0.01)] border border-white/10 px-3 sm:px-4 text-gray-300 font-semibold focus:border-blue-500 outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Target URL */}
              <div>
                <label className={`${labelCls} text-xs sm:text-sm`}>
                  Target URL
                </label>

                <input
                  type="text"
                  placeholder="eg: https://portfolio.com/api"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  disabled={loading}
                  className="w-full h-9 sm:h-11 rounded-md bg-[rgba(255,255,255,0.01)] border border-white/10 px-3 sm:px-4 text-gray-300 font-semibold focus:border-blue-500 outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Method + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={`${labelCls} text-xs sm:text-sm`}>
                    Request Method
                  </label>

                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    disabled={loading}
                    className="w-full h-9 sm:h-11 rounded-md bg-[rgba(90, 84, 84, 0.01)] border border-white/10 px-3 sm:px-4 text-gray-300 font-semibold outline-none text-xs cursor-pointer sm:text-sm"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                      <option
                        key={m}
                        value={m}
                        className="bg-[#111827] text-white"
                      >
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`${labelCls} text-xs sm:text-sm`}>
                    Expected Status Code
                  </label>

                  <div className="relative flex items-center w-full h-10 sm:h-11 rounded-md bg-[rgba(255,255,255,0.03)] px-2 sm:px-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpectedStatus((p) => Math.max(100, p - 1))
                      }
                      disabled={loading}
                      className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      min="100"
                      max="599"
                      value={expectedStatus}
                      onChange={(e) =>
                        setExpectedStatus(parseInt(e.target.value, 10) || "")
                      }
                      disabled={loading}
                      className="w-full text-center bg-transparent text-white outline-none font-semibold text-xs sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setExpectedStatus((p) => Math.min(599, p + 1))
                      }
                      disabled={loading}
                      className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeout + Interval */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={`${labelCls} text-xs sm:text-sm`}>
                    Timeout
                  </label>

                  <select
                    value={timeout}
                    onChange={(e) => setTimeoutValue(e.target.value)}
                    disabled={loading}
                    className="w-full h-9 sm:h-11 rounded-md bg-[rgba(255,255,255,0.01)] border border-white/10 px-3 sm:px-4 text-gray-300 font-semibold cursor-pointer outline-none text-xs sm:text-sm"
                  >
                    {timeoutOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-[#111827] text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`${labelCls} text-xs sm:text-sm`}>
                    Check Interval
                  </label>

                  <select
                    value={interval}
                    onChange={(e) => setIntervalValue(e.target.value)}
                    disabled={loading}
                    className="w-full h-9 sm:h-11 rounded-md bg-[rgba(255,255,255,0.01)] border border-white/10 px-3 sm:px-4 text-gray-300 font-semibold cursor-pointer outline-none text-xs sm:text-sm"
                  >
                    {intervalOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-[#111827] text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-1 sm:pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-5 sm:px-6 h-10 sm:h-12 rounded-lg bg-[var(--primary)] text-white font-semibold flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-blue-500/10 text-sm sm:text-base"
                >
                  {loading ? "Establishing Node..." : "Start Monitoring"}

                  <ArrowRight
                    size={16}
                    className="sm:w-[17px] sm:h-[17px]"
                  />
                </button>
              </div>
            </motion.form>
          </section>
        </main>
      </PageWrapper>
    </Layout>
  );
}

export default CreateMonitor;