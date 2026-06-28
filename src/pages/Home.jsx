import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

import {
  ArrowRight,
  Activity,
  AlertTriangle,
  Link as LinkIcon,
  CheckCircle,
  MonitorSmartphone,
} from "lucide-react";

import PageWrapper from "../components/PageWrapper";
import previewImg from "../assets/preview3.png";
import heroTablet from "../assets/hero-tablet3.png";
import heroResponsive from "../assets/hero-responsive1 (1).png";
import heroDynamic from "../assets/hero-dynamic1.png";

const Home = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");

  const handleCreateProject = () => {
    navigate(isAuthenticated ? "/create-project" : "/login");
  };

  const handleStartMonitoring = () => {
    navigate(isAuthenticated ? "/create-project" : "/login");
  };

  // const templates = [
  //   { title: "Website Monitoring", icon: Globe },
  //   { title: "API Monitoring", icon: Server },
  //   { title: "SSL Monitoring", icon: Shield },
  //   { title: "Heartbeat Monitoring", icon: HeartPulse },
  // ];

 // const updates = ["New Alert Engine", "Public Status Pages", "Monitor Groups"];

  return (
    <Layout>
      <PageWrapper>
        <main className="w-[80%] sm:w-[90%] md:w-[90%] lg:w-[80%] mx-auto pt-24 sm:pt-28 pb-24">

          {/* HERO */}
          <section className="min-h-[75vh] flex flex-col justify-center items-center text-center">

            <p className="text-blue-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-lg mb-10 sm:mb-20">
              UpFlow Monitoring Platform
            </p>

            <h1
              className="
                text-3xl
                sm:text-[44px]
                md:text-5xl
                font-black
                leading-[0.95]
                tracking-tight
                bg-gradient-to-b
                from-white
                via-white
                to-slate-400
                bg-clip-text
                text-transparent
              "
              style={{
                textShadow: `
                  0 2px 8px rgba(255,255,255,0.15),
                  0 10px 40px rgba(255,255,255,0.08)
                `,
              }}
            >
              Observe. Detect. Resolve.
            </h1>

            <p className="text-[var(--muted)] text-base sm:text-lg md:text-xl max-w-sm sm:max-w-xl md:max-w-3xl mt-6 sm:mt-8">
              Monitor websites, APIs and services with powerful uptime tracking,
              incident management and public status pages.
            </p>

            <div className="flex gap-3 mt-8 sm:mt-10 w-[90%] sm:w-auto text-sm sm:text-base">
              <button
                onClick={handleCreateProject}
                className="
                  flex-1 sm:flex-none
                  px-2 sm:px-6
                  py-2
                  rounded-lg
                  bg-[var(--primary)]
                  text-white
                  flex items-center justify-center gap-2
                  font-medium
                  whitespace-nowrap
                  transition-all
                  hover:opacity-90
                "
              >
                <span>Create Project</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="
                  flex-1 sm:flex-none
                  px-2 sm:px-7
                  py-2
                  rounded-lg
                  border border-[var(--border)]
                  text-white
                  flex items-center justify-center
                  font-medium
                  whitespace-nowrap
                  transition-all
                  hover:bg-white/5
                "
              >
                Explore Features
              </button>
            </div>

            {/* Preview Mockup */}
            <div className="relative mt-16 sm:mt-24 md:mt-30 w-full h-full rounded-lg shadow-lg overflow-hidden">
              <img
                src={previewImg}
                alt="UpFlow Preview"
                className="w-full h-full object-cover"
              />
              {/* Black Foggy Layer */}
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
            </div>

          </section>

          {/* MONITORING SHOWCASE */}
          <div id="features" className="pt-1">

            {/* Section 1: Monitor everything */}
            <section className="mt-24 sm:mt-32 md:mt-40 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 md:gap-16 items-start">
              <img
                src={heroTablet}
                alt="API Monitoring Dashboard"
                className="
                  h-[260px]
                  sm:h-[320px]
                  md:h-[400px]
                  w-[90%]
                  rounded-3xl
                  object-contain
                  md:scale-104
                  mix-blend-multiply
                  select-none
                  pointer-events-none
                "
              />

              <div className="mt-0 md:mt-12">
                <Activity size={30} className="text-white mb-2" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white">
                  Monitor everything.
                  <br />
                  Miss nothing.
                </h2>

                <p className="text-[var(--muted)] mt-4 sm:mt-6 text-base sm:text-lg">
                  Monitor your websites, APIs, servers, and critical services
                  from a single dashboard. Detect outages instantly, track
                  performance over time, and receive real-time alerts before
                  your users are affected.
                </p>
              </div>
            </section>

            {/* Section 2: Responsive Page */}
            <section className="mt-24 sm:mt-32 md:mt-40 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

              <div className="order-2 md:order-1">
                <MonitorSmartphone size={30} className="text-white mb-2" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-tight">
                  Your monitoring.
                  <br />
                  Always within reach.
                </h2>

                <p className="text-[var(--muted)] mt-4 sm:mt-6 text-base sm:text-lg">
                  Access projects, monitors, incidents, and uptime statistics
                  from any device. Keep track of your infrastructure whether
                  you're at your desk or on the move.
                </p>
              </div>

              <img
                src={heroResponsive}
                alt="API Monitoring Dashboard"
                className="
                  order-1
                  md:order-2
                  h-[260px]
                  sm:h-[320px]
                  md:h-[400px]
                  w-full
                  rounded-2xl
                  md:scale-125
                  object-contain
                  mix-blend-multiply
                  select-none
                  pointer-events-none
                "
              />
            </section>

            {/* Section 3: Incidents */}
            <section className="mt-24 sm:mt-32 md:mt-40 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
              <img
                src={heroDynamic}
                alt="API Monitoring Dashboard"
                className="
                  h-[260px]
                  sm:h-[320px]
                  md:h-[400px]
                  w-full
                  rounded-3xl
                  object-contain
                  md:scale-140
                  mix-blend-multiply
                  select-none
                  pointer-events-none
                "
              />

              <div className="mt-0 md:mt-12">
                <AlertTriangle size={30} className="text-white mb-2" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-tight">
                  Incidents organized.
                  <br />
                  Not hidden.
                </h2>

                <p className="text-[var(--muted)] mt-4 sm:mt-6 text-base sm:text-lg">
                  Manage incidents from detection to resolution with complete
                  visibility. Track every outage, investigate root causes,
                  monitor recovery progress, and keep your team informed with
                  real-time updates, alerts, and a centralized incident
                  timeline.
                </p>
              </div>
            </section>

          </div>

          {/* GETTING STARTED */}
          <div className="w-full max-w-6xl mx-auto pt-16 sm:pt-24 pb-14 px-2 sm:px-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white text-center mb-8 sm:mb-12 mt-6 sm:mt-10">
                Getting Started
              </h2>

              <div className="border-none overflow-hidden max-w-5xl mx-auto py-4">

                {/* Step 1 */}
                <div className="p-4 sm:p-6 py-8 sm:py-10 border-b border-slate-800/60 flex items-center gap-4 sm:gap-6 hover:bg-[#0f172a] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-base sm:text-lg mb-1">
                      1. Create a Workspace
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Group your monitors logically by project, client, or environment.
                    </p>
                  </div>
                  <Link
                    to="/create-project"
                    className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
                  >
                    <LinkIcon size={21} className="sm:w-[26px] sm:h-[26px]" />
                  </Link>
                </div>

                {/* Step 2 */}
                <div className="p-4 sm:p-6 py-8 sm:py-10 border-b border-slate-800/60 flex items-center gap-4 sm:gap-6 hover:bg-[#0f172a] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base sm:text-lg mb-1">
                      2. Deploy your first Monitor
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Add the URL of the website or API endpoint you want to track.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 sm:p-6 py-8 sm:py-10 flex items-center gap-4 sm:gap-6 hover:bg-[#0f172a] transition-colors opacity-90">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base sm:text-lg mb-1">
                      3. Stay Alerted with the Incident Overview
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Get email notifications so you know immediately when a monitor fails.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* CTA */}
          <section className="mt-15 sm:mt-20 text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
              Ready to monitor smarter?
            </h2>

            <p className="text-[var(--muted)] text-base sm:text-lg mt-4 sm:mt-6">
              Create your first project and start monitoring today.
            </p>

            <button
              onClick={handleStartMonitoring}
              className="
                mt-8 sm:mt-10
                px-6 py-3
                rounded-lg
                bg-[var(--primary)]
                text-white
                font-medium
              "
            >
              Start Monitoring
            </button>
          </section>

        </main>
      </PageWrapper>
    </Layout>
  );
};

export default Home;