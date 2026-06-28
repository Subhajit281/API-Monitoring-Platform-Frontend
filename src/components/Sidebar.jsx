import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  House,
  FilePenLine,
  FolderOpen,
  Activity,
  AlertTriangle,
  User,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : true;
  });

  const isAuthenticated = !!localStorage.getItem("token");

  const navItems = [
    { path: "/",                label: "Home",           icon: House },
    { path: "/projects",        label: "Projects",      icon: FolderOpen },
    { path: "/create-project",  label: "Create", icon: FilePenLine },
    { path: "/project-monitors",label: "Monitors",       icon: Activity },
    { path: "/incident",        label: "Incidents",      icon: AlertTriangle },
    { path: "/profile",         label: "Profile",        icon: User },
  ];

  const toggleSidebar = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(nextState));
  };

  const checkIsActive = (itemPath) => {
    const currentPath = location.pathname;
    if (itemPath === "/") return currentPath === "/";
    if (itemPath === "/projects") return currentPath === "/projects";
    if (itemPath === "/project-monitors") {
      return currentPath === "/project-monitors" || (currentPath.startsWith("/projects/") && currentPath.length > 10);
    }
    return currentPath.startsWith(itemPath);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* ── MOBILE: bottom tab bar ───────────────────────────────────────── */}
      <nav
        className="
          md:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          items-center
          justify-center
          py-1
          px-0
         
          safe-area-bottom
        "
        style={{
          background: "rgba(36, 47, 68, 0.85)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex w-[70px]  flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all duration-100"
              style={{
                color: isActive ? "var(--primary, #4181e9)" : "rgba(255, 246, 246, 0.6)",
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "transparent" : "transparent",
                }}
              >
                <Icon size={19} />
              </span>
              <span className="text-[11px] font-white mt-0 mb-1 leading-none tracking-wide">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* ── DESKTOP: floating pill sidebar ──────────────────────────────── */}
      <aside
        className={`
          hidden md:block
          fixed left-4 top-1/2 -translate-y-1/2
          z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[62px]" : "w-[176px]"}
        `}
      >
        <div
          className="relative rounded-4xl shadow-2xl overflow-visible py-4"
          style={{
            background: "rgba(27, 43, 72, 0.55)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Toggle handle */}
          <div
            onClick={toggleSidebar}
            className="
              absolute top-1/2 left-full -translate-y-1/2
              cursor-pointer flex items-center justify-center
              w-4 h-[68px]
              transition-all duration-300
            "
            style={{
              background: "rgba(27, 43, 72, 0.55)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              clipPath: "polygon(0 0, 100% 15%, 100% 85%, 0 100%)",
            }}
          >
            {collapsed ? (
              <ChevronRight size={18} className="text-white" />
            ) : (
              <ChevronLeft size={18} className="text-white" />
            )}
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = checkIsActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center rounded-xl py-3
                    transition-all duration-300
                    ${collapsed ? "justify-center" : "gap-3 px-3"}
                  `}
                  style={{
                    backgroundColor: isActive ? "var(--primary)" : "transparent",
                    color: "var(--text)",
                  }}
                >
                  <Icon size={collapsed ? 21 : 20} className="transition-all duration-300 shrink-0" />
                  <span
                    className={`
                      whitespace-nowrap overflow-hidden
                      transition-all duration-300 text-sm font-medium
                      ${collapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"}
                    `}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;