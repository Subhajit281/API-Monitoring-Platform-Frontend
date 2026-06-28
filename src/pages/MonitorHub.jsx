import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { Activity, FolderSearch, ArrowRight } from "lucide-react";

function MonitorHub() {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[86%] sm:w-[80%] lg:w-[70%] max-w-4xl mx-auto pt-24 sm:pt-32 pb-16 sm:pb-24 flex flex-col items-center justify-center min-h-[80vh]">

            <div className="border-none p-6 sm:p-12 flex flex-col items-center text-center max-w-lg relative overflow-hidden">

              {/* Background Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32" />

              <div className="p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 border-none">
                <Activity
                  size={32}
                  className="text-blue-500 animate-pulse sm:w-10 sm:h-10"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight mb-2 sm:mb-3">
                Monitor Hub
              </h1>

              <p className="text-xs sm:text-sm text-[var(--muted)] mb-6 sm:mb-8 leading-relaxed">
                To view real-time telemetry, latency charts, and uptime metrics, please
                select a specific project workspace.
              </p>

              <button
                onClick={() => navigate("/projects")}
                className="w-full h-10 sm:h-auto sm:py-3 bg-blue-700 hover:bg-blue-600 text-white text-sm sm:text-base rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FolderSearch
                  size={16}
                  className="sm:w-[18px] sm:h-[18px]"
                />
                Select a Project
                <ArrowRight
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] ml-1"
                />
              </button>

            </div>

          </main>
      </PageWrapper>
    </Layout>
  );
}

export default MonitorHub;