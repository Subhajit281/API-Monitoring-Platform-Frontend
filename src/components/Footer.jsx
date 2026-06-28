//import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] border-t border-slate-800/60 pt-6 sm:pt-8 pb-2 sm:pb-0 px-4 sm:px-8 mt-auto relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-8xl mx-auto relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10 sm:gap-16 md:gap-8 mb-10 sm:mb-12 md:mb-16">

          {/* Brand Section */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <h2 className="text-blue-400 font-bold text-lg sm:text-xl tracking-tight">
                UpFlow
              </h2>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 max-w-xs">
              Enterprise-grade synthetic monitoring for modern frontend teams.
              Catch downtime before your users do.
            </p>

            {/* Social Icons */}
            {/* <div className="flex gap-8">
              ...
            </div> */}
          </div>

          {/* Platform */}
          <div className="sm:ml-25">
            <h4 className="text-slate-200 font-bold text-xs sm:text-sm mb-3 sm:mb-5 uppercase tracking-wider">
              Platform
            </h4>

            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400 font-medium">
              <li>
                <Link to="/projects" className="hover:text-blue-400 transition-colors">
                  Workspaces
                </Link>
              </li>

              <li>
                <Link to="/incident" className="hover:text-blue-400 transition-colors">
                  Incident Hub
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Global Network
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-slate-200 font-bold text-xs sm:text-sm mb-3 sm:mb-5 uppercase tracking-wider">
              Resources
            </h4>

            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400 font-medium">
              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Documentation
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  API Reference
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Community
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="sm:ml-25">
            <h4 className="text-slate-200 font-bold text-xs sm:text-sm mb-3 sm:mb-5 uppercase tracking-wider">
              Company
            </h4>

            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400 font-medium">
              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Security Setup
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 pb-10 sm:pb-22 border-t border-slate-800/60">
          <p className="text-slate-500 text-xs sm:text-sm font-medium text-center">
            © {new Date().getFullYear()} UpFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;