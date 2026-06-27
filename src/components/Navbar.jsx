import { useState, useEffect } from 'react';
import { ChevronDown, Users, MailWarning, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Small reusable "Soon" badge used in both desktop and mobile menus
function SoonBadge() {
  return (
    <span className="text-[9px] uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
      Soon
    </span>
  );
}

function Navbar() {
  const navigate = useNavigate();

  // Controls the mobile sliding panel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Controls which accordion section is open on mobile ('features' | 'solutions' | null)
  const [expandedSection, setExpandedSection] = useState(null);
  // Controls the logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");
 // const userInitial = (localStorage.getItem("name") || "U")[0].toUpperCase();

  // Opens the confirmation modal instead of logging out immediately
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Actually performs the logout once the user confirms in the modal
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setShowLogoutModal(false);
    closeMobileMenu();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedSection(null);
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Lock body scroll while the mobile panel is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        setShowLogoutModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header
        className="
          fixed
          top-4
          left-1/2
          -translate-x-1/2
          w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%]
          max-w-7xl
          h-16
          px-7
          flex
          items-center
          justify-between
          rounded-4xl
          border
          backdrop-blur-2xl
          shadow-2xl
          z-50
        "
        style={{
          background: "rgba(27, 43, 72, 0.55)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >

        <div className="flex items-center gap-20">

          {/* Logo (Always Visible) */}
          <Link to="/" className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">
              UpFlow
            </h1>
          </Link>

          {/* Center Navigation Links (Hidden on Mobile) — unchanged desktop experience */}
          <nav className="hidden md:flex items-center gap-6 h-full text-sm font-medium text-slate-300">

            {/* 1. FEATURES DROPDOWN */}
            <div className="group h-16 flex items-center relative">
              <button className="flex items-center gap-1.5 hover:text-white transition-colors text-[17px] h-full">
                Features <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Features Mega Menu Content */}
              <div className="absolute top-[60px] -left-20 w-[700px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2 cursor-default">
                <div className="bg-[#0b0f19] border border-slate-700/80 shadow-2xl rounded-lg p-6 flex gap-10">
                  {/* Col 1: Uptime */}
                  <div className="flex-1">
                    <h3 className="flex items-center gap-2 text-blue-400 mb-4 font-semibold text-lg">Uptime monitoring</h3>
                    <ul className="space-y-3 text-[14px]">
                      <li><Link to="#" className="text-white hover:text-blue-400 transition-colors">Website & endpoint monitoring</Link></li>
                      <li><Link to="#" className="text-white hover:text-blue-400 transition-colors">API monitoring</Link></li>
                      <li className="flex items-center justify-between text-slate-500">Keyword monitoring <SoonBadge /></li>
                      <li className="flex items-center justify-between text-slate-500">Ping monitoring <SoonBadge /></li>
                      <li className="flex items-center justify-between text-slate-500">Port monitoring <SoonBadge /></li>
                      <li className="flex items-center justify-between text-slate-500">Cron job monitoring <SoonBadge /></li>
                    </ul>
                  </div>
                  {/* Col 2: Features */}
                  <div className="flex-1 border-l border-slate-800/60 pl-8">
                    <h3 className="flex items-center gap-2 text-blue-400 mb-4 font-semibold text-lg">Monitoring features</h3>
                    <ul className="space-y-3 text-[14px]">
                      <li><Link to="#" className="text-white hover:text-blue-400 transition-colors">Response time monitoring</Link></li>
                      <li className="flex items-center justify-between text-slate-500">Multi-location monitoring <SoonBadge /></li>
                      <li className="flex items-center justify-between text-slate-500">SSL monitoring <SoonBadge /></li>
                      <li className="flex items-center justify-between text-slate-500">Domain monitoring <SoonBadge /></li>
                    </ul>
                  </div>
                  {/* Col 3: Management */}
                  <div className="flex-1 border-l border-slate-800/60 pl-8">
                    <h3 className="flex items-center gap-2 text-blue-400 mb-4 font-semibold text-lg">Record Incidents</h3>
                    <ul className="space-y-3 text-[14px]">
                      <li><Link to="#" className="text-white hover:text-blue-400 transition-colors">Email Alerts</Link></li>
                      <li className="flex items-center justify-between text-slate-500">IT Alerting <SoonBadge /></li>
                      <li className="flex items-center justify-between text-slate-500">Status Pages <SoonBadge /></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SOLUTIONS DROPDOWN */}
            <div className="group h-16 flex items-center relative">
              <button className="flex items-center gap-1.5 hover:text-white transition-colors h-full text-[17px]">
                Solutions <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-[60px] -left-10 w-[450px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2 cursor-default">
                <div className="bg-[#0b0f19] border border-slate-700/80 shadow-2xl rounded-lg p-6 flex gap-8">
                  <div className="flex-1">
                    <h3 className="flex items-center gap-2 text-blue-400 mb-4 font-semibold text-md">
                      <Users size={16} className="text-blue-400" /> For every team
                    </h3>
                    <ul className="space-y-3 text-[14px] text-slate-300">
                      <li><Link to="#" className="hover:text-white transition-colors">DevOps</Link></li>
                      <li><Link to="#" className="hover:text-white transition-colors">Developers</Link></li>
                      <li><Link to="#" className="hover:text-white transition-colors">Business Owners</Link></li>
                    </ul>
                  </div>
                  <div className="flex-1 border-l border-slate-800/60 pl-8">
                    <h3 className="flex items-center gap-2 text-blue-400 mb-4 font-semibold text-sm">Go further with</h3>
                    <ul className="space-y-5 text-[14px] text-slate-300">
                      <li><Link to="#" className="hover:text-white transition-colors">API Integration</Link></li>
                      <li><Link to="#" className="hover:text-white transition-colors">Webhooks</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PRICING */}
            <div className="h-16 flex items-center relative group cursor-pointer">
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-2 text-[17px]">
                Pricing
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border-none px-2 py-0.5 rounded-md">Soon</span>
              </Link>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">

          {/* Desktop Auth (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate(`/incident`)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-white/10"
                  style={{ color: "#2196f3" }}
                >
                  <MailWarning size={23} />
                </button>
                <Link to="/profile">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all shadow-lg"
                    style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                  >
                    <User size={17}/>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle (Hidden on Desktop) */}
          <button
            className="md:hidden text-slate-300 hover:text-white transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={28} />
          </button>

        </div>
      </header>

      {/* ===== MOBILE SLIDE-IN PANEL ===== */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Sliding panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[360px] z-[100] md:hidden flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(11, 15, 25, 0.98)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 h-16 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span className="text-lg font-bold text-white tracking-tight">UpFlow</span>
          <button
            onClick={closeMobileMenu}
            className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable nav content */}
        <nav className="flex-1 overflow-y-auto px-5 py-4 text-[15px] font-medium text-slate-300">

          {/* FEATURES — accordion */}
          <div className="border-b border-white/5">
            <button
              onClick={() => toggleSection("features")}
              className="w-full flex items-center justify-between py-4 hover:text-white transition-colors text-left"
              aria-expanded={expandedSection === "features"}
            >
              Features
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 text-slate-400 ${expandedSection === "features" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedSection === "features" ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-4 pl-1 flex flex-col gap-5">
                <div>
                  <h4 className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5">Uptime monitoring</h4>
                  <ul className="flex flex-col gap-3 text-[14px]">
                    <li><Link to="#" onClick={closeMobileMenu} className="text-slate-200 hover:text-blue-400 transition-colors">Website & endpoint monitoring</Link></li>
                    <li><Link to="#" onClick={closeMobileMenu} className="text-slate-200 hover:text-blue-400 transition-colors">API monitoring</Link></li>
                    <li className="flex items-center justify-between text-slate-500">Keyword monitoring <SoonBadge /></li>
                    <li className="flex items-center justify-between text-slate-500">Ping monitoring <SoonBadge /></li>
                    <li className="flex items-center justify-between text-slate-500">Port monitoring <SoonBadge /></li>
                    <li className="flex items-center justify-between text-slate-500">Cron job monitoring <SoonBadge /></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5">Monitoring features</h4>
                  <ul className="flex flex-col gap-3 text-[14px]">
                    <li><Link to="#" onClick={closeMobileMenu} className="text-white hover:text-slate-200 transition-colors">Response time monitoring</Link></li>
                    <li className="flex items-center justify-between text-slate-500">Multi-location monitoring <SoonBadge /></li>
                    <li className="flex items-center justify-between text-slate-500">SSL monitoring <SoonBadge /></li>
                    <li className="flex items-center justify-between text-slate-500">Domain monitoring <SoonBadge /></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5">Record Incidents</h4>
                  <ul className="flex flex-col gap-3 text-[14px]">
                    <li><Link to="#" onClick={closeMobileMenu} className="text-slate-200 hover:text-blue-400 transition-colors">Email Alerts</Link></li>
                    <li className="flex items-center justify-between text-slate-500">IT Alerting <SoonBadge /></li>
                    <li className="flex items-center justify-between text-slate-500">Status Pages <SoonBadge /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SOLUTIONS — accordion */}
          <div className="border-b border-white/5">
            <button
              onClick={() => toggleSection("solutions")}
              className="w-full flex items-center justify-between py-4 hover:text-white transition-colors text-left"
              aria-expanded={expandedSection === "solutions"}
            >
              Solutions
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 text-slate-400 ${expandedSection === "solutions" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedSection === "solutions" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-4 pl-1 flex flex-col gap-5">
                <div>
                  <h4 className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
                    <Users size={14} /> For every team
                  </h4>
                  <ul className="flex flex-col gap-3 text-[14px]">
                    <li><Link to="#" onClick={closeMobileMenu} className="text-white hover:text-blue-400 transition-colors">DevOps</Link></li>
                    <li><Link to="#" onClick={closeMobileMenu} className="text-white hover:text-blue-400 transition-colors">Developers</Link></li>
                    <li><Link to="#" onClick={closeMobileMenu} className="text-white hover:text-blue-400 transition-colors">Business Owners</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5">Go further with</h4>
                  <ul className="flex flex-col gap-3 text-[14px]">
                    <li><Link to="#" onClick={closeMobileMenu} className="text-white hover:text-blue-400 transition-colors">API Integration</Link></li>
                    <li><Link to="#" onClick={closeMobileMenu} className="text-white hover:text-blue-400 transition-colors">Webhooks</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* PRICING — plain link, no accordion needed */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center justify-between py-4 hover:text-white transition-colors border-b border-white/5"
          >
            Pricing
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border-none px-2 py-0.5 rounded-md">
              Soon
            </span>
          </Link>
        </nav>

        {/* Auth footer — pinned to bottom */}
        <div
          className="px-5 py-5 border-t shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-white font-medium hover:bg-white/5 p-2.5 rounded-lg transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  <User size={17}/>
                </div>
                My Profile
              </Link>
              <button
                onClick={() => { navigate(`/incident`); closeMobileMenu(); }}
                className="flex items-center gap-3 text-white font-medium hover:bg-white/5 p-2.5 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center text-blue-400">
                  <MailWarning size={20} />
                </div>
                Incidents
              </button>
              <button
                onClick={handleLogout}
                className="mt-1 w-[50%] text-center py-2 text-red-400 hover:text-white font-medium rounded-xl hover:bg-white/5 transition-colors border border-white/10"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full text-center py-3 text-slate-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-colors border border-white/10"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="w-full text-center py-3 font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* SECURE LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="w-12 h-12 rounded-full border-none flex items-center justify-center text-red-500 mb-4 mx-auto">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2">Sign Out</h3>
              <p className="text-slate-400 text-sm text-center mb-6 sm:mb-8">
                Are you sure you want to log out of your account? You will need to log in again to manage your monitors.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-500 hover:bg-red-500 transition-colors"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;