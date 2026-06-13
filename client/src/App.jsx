import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TelemetryPage from './pages/TelemetryPage';
import Analytics from './pages/Analytics';
import Incidents from './pages/Incidents';
import SystemLogs from './pages/SystemLogs';
import DevOps from './pages/DevOps';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-space-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan/30 border-t-cyan rounded-full animate-spin mx-auto mb-4" />
        <p className="font-heading text-cyan text-sm tracking-widest">INITIALIZING...</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/telemetry" element={<ProtectedRoute><AppLayout><TelemetryPage /></AppLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute><AppLayout><Incidents /></AppLayout></ProtectedRoute>} />
      <Route path="/logs" element={<ProtectedRoute><AppLayout><SystemLogs /></AppLayout></ProtectedRoute>} />
      <Route path="/devops" element={<ProtectedRoute><AppLayout><DevOps /></AppLayout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout><AdminPanel /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10,15,30,0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(0,212,255,0.3)',
              backdropFilter: 'blur(10px)',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#020817' } },
            error:   { iconTheme: { primary: '#ff6b35', secondary: '#020817' } },
          }}
        />
      </AuthProvider>
    </HashRouter>
  );
}
