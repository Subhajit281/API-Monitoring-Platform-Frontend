//import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] border-t border-slate-800/60 pt-12 sm:pt-16 pb-8 px-6 mt-auto relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-10 mb-12 md:mb-16">

          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              
              <h2 className="text-blue-400 font-black text-2xl tracking-tight">UpFlow</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Enterprise-grade synthetic monitoring for modern frontend teams. Catch downtime before your users do.
            </p>
            {/* <div className="flex gap-8">
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors bg-slate-900/50 p-2 rounded-lg border border-slate-800 hover:border-blue-500/30">
                <GitHub size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors bg-slate-900/50 p-2 rounded-lg border border-slate-800 hover:border-blue-500/30">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors bg-slate-900/50 p-2 rounded-lg border border-slate-800 hover:border-blue-500/30">
                <Linkedin size={18} />
              </a>
            </div> */}
          </div>

          {/* Links: Product */}
          <div className="sm:ml-25">
            <h4 className="text-slate-200 font-bold text-sm mb-5 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link to="/projects" className="hover:text-blue-400 transition-colors">Workspaces</Link></li>
              <li><Link to="/incident" className="hover:text-blue-400 transition-colors">Incident Hub</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Global Network</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div>
            <h4 className="text-slate-200 font-bold text-sm mb-5 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">API Reference</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Community</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div className="sm:ml-25 ">
            <h4 className="text-slate-200 font-bold text-sm mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Security Setup</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Status Indicator */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 pb-22 border-t border-slate-800/60">
          <p className="text-slate-500 text-sm font-medium text-center">
            © {new Date().getFullYear()} UpFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;