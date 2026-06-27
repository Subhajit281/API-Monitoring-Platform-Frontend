import { Routes, Route } from "react-router-dom";

import FixedBackground from "./components/FixedBackground";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MonitorDetails from "./pages/MonitorDetails";
import Incident from "./pages/Incident";
import Profile from "./pages/Profile";
import ProjectMonitors from "./pages/ProjectMonitors";
import CreateProjects from "./pages/CreateProjects";
import CreateMonitor from "./pages/CreateMonitor";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MonitorHub from "./pages/MonitorHub";
import MonitorAlerts from "./pages/MonitorAlerts";
import ProtectedRoute from "./routes/ProtectedRoutes";
import ProjectOverview from "./pages/ProjectOverview";

function App() {
  return (
    <>
      {/* Mounted ONCE for the app's entire lifetime — survives every route change */}
      <FixedBackground />

      <Routes>
        {/* PUBLIC AUTHENTICATION ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* PROTECTED WORKSPACE ROUTES */}
        <Route path="/project-monitors" element={
          <ProtectedRoute><MonitorHub /></ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/projects/:projectId" element={
          <ProtectedRoute><ProjectOverview /></ProtectedRoute>
        } />
        <Route
          path="/projects/:projectId/monitors/:monitorId/alerts"
          element={
            <ProtectedRoute>
              <MonitorAlerts />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/incident" element={
          <ProtectedRoute><Incident /></ProtectedRoute>
        } />
        <Route path="/create-project" element={
          <ProtectedRoute><CreateProjects /></ProtectedRoute>
        } />
        <Route path="/projects/:projectId/monitors" element={
          <ProtectedRoute><ProjectMonitors /></ProtectedRoute>
        } />
        <Route path="/projects/:projectId/monitors/create" element={
          <ProtectedRoute><CreateMonitor /></ProtectedRoute>
        } />
        <Route path="/monitor-details" element={
          <ProtectedRoute><MonitorDetails /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;