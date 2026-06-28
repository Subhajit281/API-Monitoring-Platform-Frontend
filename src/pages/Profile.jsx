import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { 
  User, Mail, Shield, Settings, LogOut, Activity, Folder, AlertTriangle, CheckCircle,
  Calendar, Edit3, Menu, X
} from "lucide-react";

import { getUserProfile, updateUserProfile, changeUserPassword } from "../services/api"; 
import { getProfileAnalytics } from "../services/profileAnalytics.service";

const NAVY_COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'];

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setEditForm({ name: userData.name, email: userData.email });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalyticsData = async () => {
      try {
        setLoadingAnalytics(true);
        const response = await getProfileAnalytics();
        const analyticsData = response.data || response; 
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        setAnalytics({
          weeklyVisits: [],
          weeklyApiCalls: [],
          monitorsByProject: [],
          incidentStats: []
        });
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchUserData();
    fetchAnalyticsData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // close mobile sidebar on tab select
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const updatedData = await updateUserProfile(editForm);
      setUser({ ...user, name: updatedData.name, email: updatedData.email });
      setIsEditingProfile(false); 
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: "", success: "" });
    
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordStatus({ loading: false, error: "New passwords do not match.", success: "" });
      return;
    }

    try {
      await changeUserPassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new
      });
      setPasswordStatus({ loading: false, error: "", success: "Password successfully updated." });
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      setPasswordStatus({ 
        loading: false, 
        error: error?.response?.data?.message || "Failed to update password.", 
        success: "" 
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageWrapper>
          <div className="w-[90%] sm:w-full max-w-4xl mx-auto min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </PageWrapper>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <PageWrapper>
          <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
             <AlertTriangle size={48} className="text-red-500 mb-4" />
             <h2 className="text-xl font-bold text-white mb-2">Profile Data Unavailable</h2>
             <p className="text-slate-400 text-sm mb-6">Service might took a while to reconnect. Please keep Patience</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-500">
               Retry Connection
             </button>
          </div>
        </PageWrapper>
      </Layout>
    );
  }

  const navItems = [
    { id: "overview", label: "Global Overview", icon: Activity },
    { id: "profile",  label: "Personal Details", icon: User },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "settings", label: "Preferences",       icon: Settings },
  ];

  return (
    <Layout>
      <PageWrapper>
       <main className="w-[90%] sm:w-full max-w-7xl mx-auto pt-16 sm:pt-28 lg:pt-32 pb-12 sm:pb-24 px-3 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-6 mt-6 sm:mb-10 mt-0 border-b border-slate-800 pb-5 sm:pb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-white tracking-tight">Account Settings</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5">Manage your personal data, global workspace analytics, and platform security.</p>
            </div>
            {/* Mobile sidebar toggle */}
            <button
              className="md:hidden mt-1 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            
            {/* SIDEBAR NAVIGATION */}
            {/* Mobile: overlay drawer; Desktop: sticky sidebar */}
            <>
              {/* Mobile overlay backdrop */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              <aside
                className={`
                  fixed inset-y-0 left-0 z-40 w-64 bg-[#080d18] border-r border-slate-800 pt-24 px-4 pb-8
                  transform transition-transform duration-300 ease-in-out
                  md:static md:inset-auto md:z-auto md:w-56 lg:w-64 md:bg-transparent md:border-none 
                  md:pt-0 md:px-0 md:pb-0 md:transform-none md:transition-none
                  ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
              >
                <nav className="flex flex-col gap-1.5 md:sticky md:top-32">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleTabChange(id)}
                      className={`flex items-center gap-3 w-full p-3 rounded-md text-sm font-semibold transition-all ${
                        activeTab === id
                          ? "bg-blue-500/10 text-blue-400 border-none"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                      }`}
                    >
                      <Icon size={18} /> {label}
                    </button>
                  ))}
                  
                  <div className="h-px bg-slate-800/80 my-3" />
                  
                  <button 
                    onClick={() => { setSidebarOpen(false); setShowLogoutModal(true); }}
                    className="flex items-center gap-3 w-full p-3.5 rounded-md text-sm font-semibold text-red-400/80 border border-transparent hover:text-red-500 transition-all"
                  >
                    <LogOut size={19} /> Sign Out
                  </button>
                </nav>
              </aside>
            </>

            {/* MAIN CONTENT AREA */} 
            <div className="flex-1 min-w-0">
              
              {/* TAB 1: OVERVIEW & CHARTS */}
              {activeTab === "overview" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                    <defs>
                      <linearGradient id="gradientResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="gradientActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#475569" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Charts Grid — 1 col mobile, 2 col xl */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    
                    {/* Weekly Visits Histogram */}
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-md p-4 sm:p-6 shadow-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                        <BarChart size={16} className="text-blue-500"/> Platform Visits
                      </h3>
                      <div className="h-52 sm:h-64 w-full">
                        {loadingAnalytics ? (
                           <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">Loading analytics...</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                            <BarChart data={analytics?.weeklyVisits || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                              <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                              <Tooltip 
                                cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                                contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }} 
                                itemStyle={{ color: "#e2e8f0", fontWeight: "500" }}
                                labelStyle={{ color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}
                              />
                              <Bar 
                                dataKey="visits" 
                                fill="url(#gradientResolved)"
                                radius={[4, 4, 0, 0]} 
                                maxBarSize={40}
                                animationDuration={1500}
                                animationEasing="ease-out"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* API Calls Line Chart */}
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-md p-4 sm:p-6 shadow-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500"/> Total Monitor Checks
                      </h3>
                      <div className="h-52 sm:h-64 w-full relative">
                        <div className="absolute inset-0 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none" />
                        {loadingAnalytics ? (
                           <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">Loading analytics...</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <LineChart data={analytics?.weeklyApiCalls || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                              <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }} 
                                itemStyle={{ color: "#e2e8f0", fontWeight: "500" }}
                                labelStyle={{ color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="calls" 
                                stroke="url(#gradientLine)" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: '#0b0f19', stroke: '#60a5fa', strokeWidth: 2 }} 
                                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                                animationDuration={1500}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-md p-4 sm:p-6 shadow-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500"/> Monitors by Project
                      </h3>
                      {analytics?.monitorsByProject?.length > 0 ? (
                        <div className="h-52 sm:h-64 w-full relative">
                          <div className="absolute inset-0 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
                          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <PieChart>
                              <Pie 
                                data={analytics.monitorsByProject} 
                                innerRadius={55} 
                                outerRadius={85} 
                                paddingAngle={0.2} 
                                dataKey="monitors" 
                                stroke="none"
                                animationDuration={1500}
                                animationEasing="ease-out"
                              >
                                {analytics.monitorsByProject.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={NAVY_COLORS[index % NAVY_COLORS.length]} 
                                    stroke="#0b0f19"
                                    strokeWidth={4}
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }} 
                                itemStyle={{ color: "#fff" }} 
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-52 sm:h-64 flex flex-col items-center justify-center text-slate-600 text-sm">
                          <Folder size={32} className="mb-2 opacity-30"/>
                          <p>{loadingAnalytics ? "Loading allocation data..." : "No monitors mapped to workspaces yet."}</p>
                        </div>
                      )}
                    </div>

                    {/* Incident Health Bar Chart */}
                    <div className="bg-[#0b0f19] border border-slate-800 rounded-md p-4 sm:p-6 shadow-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                        <BarChart size={16} className="text-blue-500"/> Global Incident Health
                      </h3>
                      <div className="h-52 sm:h-64 w-full">
                        {loadingAnalytics ? (
                           <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">Loading incident stats...</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <BarChart data={analytics?.incidentStats || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                              <XAxis dataKey="status" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                              <YAxis allowDecimals={false} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                              <Tooltip 
                                cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                                contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }} 
                                itemStyle={{ color: "#e2e8f0", fontWeight: "500" }}
                                labelStyle={{ color: "#94a3b8", fontWeight: "bold", marginBottom: "4px" }}
                              />
                              <Bar 
                                dataKey="count" 
                                radius={[4, 4, 0, 0]} 
                                maxBarSize={60}
                                animationDuration={1500}
                                animationEasing="ease-out"
                              >
                                {(analytics?.incidentStats || []).map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.status === 'OPEN' ? 'url(#gradientActive)' : 'url(#gradientResolved)'} 
                                    stroke={entry.status === 'OPEN' ? '#334155' : '#3b82f6'}
                                    strokeWidth={1}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE DETAILS */}
              {activeTab === "profile" && (
                <div className="border-l-2 border-gray-800 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-800 pb-4 mb-4 gap-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Personal Information</h2>
                      <p className="text-sm text-slate-400 mt-1">Manage your identity and contact details.</p>
                    </div>
                    {!isEditingProfile && (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="self-start sm:self-auto px-4 py-2 border-none text-blue-400 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 hover:text-blue-300"
                      >
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    )}
                  </div>

                  {!isEditingProfile ? (
                    <div className="space-y-2 max-w-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-0 p-3 rounded-lg bg-[#0f172a] border border-slate-800">
                        <div className="col-span-1 text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-2"><User size={15}/> Full Name</div>
                        <div className="sm:col-span-2 text-sm sm:text-md text-slate-200 font-medium sm:pl-2">{user.name}</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-0 p-3 rounded-lg bg-[#0f172a] border border-slate-800">
                        <div className="col-span-1 text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-2"><Mail size={15}/> Email Address</div>
                        <div className="sm:col-span-2 text-sm sm:text-md text-slate-200 font-medium sm:pl-2 break-all">{user.email}</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-0 p-3 rounded-lg bg-[#0f172a] border border-slate-800">
                        <div className="col-span-1 text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-2"><Calendar size={15}/> Member Since</div>
                        <div className="sm:col-span-2 text-sm sm:text-md text-slate-200 font-medium sm:pl-2">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleEditSubmit} className="space-y-4 w-full max-w-md bg-[#0f172a] p-4 sm:p-6 rounded-lg border border-slate-800">
                      <div>
                        <label className="block text-sm font-semibold text-slate-400 mb-2">Full Name</label>
                        <input
                          type="text" required value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-400 mb-2">Email Address</label>
                        <input
                          type="email" required value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                      </div>
                      <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button" onClick={() => { setIsEditingProfile(false); setEditForm({name: user.name, email: user.email}); }}
                          className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-sm transition-colors border border-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit" disabled={isSavingProfile}
                          className="flex-1 px-4 py-2.5 bg-blue-700 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                        >
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: SECURITY */}
              {activeTab === "security" && (
                <div className="border-l-2 border-gray-800 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-slate-800 pb-6 mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Security Details</h2>
                    <p className="text-sm text-slate-400 mt-1">Update your password to keep your account safe.</p>
                  </div>
                  
                  {passwordStatus.error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
                      <AlertTriangle size={18} className="shrink-0 mt-0.5"/> {passwordStatus.error}
                    </div>
                  )}
                  {passwordStatus.success && (
                    <div className="mb-6 p-4 bg-blue-900/20 border border-blue-900/50 rounded-xl text-blue-400 text-sm flex items-start gap-2">
                      <CheckCircle size={18} className="shrink-0 mt-0.5"/> {passwordStatus.success}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-5 w-full max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Current Password</label>
                      <input
                        type="password" required value={passwordForm.current}
                        onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                        className="w-full bg-[#020617] border border-slate-800 rounded-lg px-4 py-2 sm:py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">New Password</label>
                      <input
                        type="password" required minLength={6} value={passwordForm.new}
                        onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                        className="w-full bg-[#020617] border border-slate-800 rounded-lg px-4 py-2 sm:py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Confirm New Password</label>
                      <input
                        type="password" required minLength={6} value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        className="w-full bg-[#020617] border border-slate-800 rounded-lg px-4 py-2 sm:py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit" disabled={passwordStatus.loading}
                        className="w-full sm:w-auto px-4 py-3 bg-blue-700 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 mb-4"
                      >
                        {passwordStatus.loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === "settings" && (
                <div className="border-l-2 border-gray-800 p-4 sm:p-8 flex flex-col items-center justify-center text-center py-16 sm:py-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="rounded-lg border-none flex items-center justify-center mb-4">
                    <Settings size={32} className="text-slate-500" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Advanced Preferences</h2>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-xs sm:max-w-sm">
                    Configure webhooks, notification rules, and timezone settings here in future updates.
                  </p>
                </div>
              )}

            </div>
          </div>
        </main>
      </PageWrapper>

      {/* SECURE LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg w-[90%] max-w-sm shadow-xl relative overflow-hidden">
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
    </Layout>
  );
}

export default Profile;