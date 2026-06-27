import { Activity, Shield, BarChart3 } from "lucide-react";
import PageWrapper from "../PageWrapper";
function AuthLayout({ children }) {
  return (
    <PageWrapper>
      <div
        className="min-h-screen flex flex-col items-center justify-start pt-10 pb-16 px-4"
        style={{
          background:
            "linear-gradient(135deg, #08111F 0%, #0D1730 50%, #15253F 100%)",
        }}
      >
        {/* TOP: Logo centered */}
        <div className="flex items-center gap-2 mb-8">
          
          <span className="text-white font-semibold text-xl tracking-tight">
            UpFlow
          </span>
        </div>

        {/* CARD: matches the reference — bordered, rounded, contained */}
        <div
          className="w-full rounded-lg p-8"
          style={{
            maxWidth: "480px",
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {children}
        </div>

        {/* BOTTOM: Feature pills — hidden on mobile, subtle on desktop */}
        <div className="hidden sm:flex items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Activity size={14} className="text-blue-500" />
            Real-time monitoring
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Shield size={14} className="text-blue-500" />
            Incident management
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <BarChart3 size={14} className="text-blue-500" />
            Uptime analytics
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default AuthLayout;