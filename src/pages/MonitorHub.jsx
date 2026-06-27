import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { Activity, FolderSearch, ArrowRight } from "lucide-react";

function MonitorHub() {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[70%] max-w-4xl mx-auto pt-32 pb-24 flex flex-col items-center justify-center min-h-[80vh]">
          
          <div className=" border-none p-12 flex flex-col items-center text-center max-w-lg relative overflow-hidden">
            
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 -none" />

            <div className=" p-4 rounded-2xl mb-4 border-none">
              <Activity size={40} className="text-blue-500 animate-pulse" />
            </div>

            <h1 className="text-3xl font-medium text-white tracking-tight mb-3">
            Monitor Hub
            </h1>
            
            <p className="text-[var(--muted)] text-sm mb-8 leading-relaxed">
              To view real-time telemetry, latency charts, and uptime metrics, please select a specific project workspace.
            </p>

            <button
              onClick={() => navigate("/projects")}
              className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <FolderSearch size={18} />
              Select a Project
              <ArrowRight size={18} className="ml-1" />
            </button>

          </div>

        </main>
      </PageWrapper>
    </Layout>
  );
}

export default MonitorHub;