import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Wifi, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const routeLabels = {
  '/dashboard': { label: 'Mission Control', sub: 'Real-time operations overview' },
  '/telemetry':  { label: 'Telemetry Feed',  sub: 'Live spacecraft sensor data' },
  '/analytics':  { label: 'Mission Analytics', sub: 'Performance insights & trends' },
  '/incidents':  { label: 'Incident Management', sub: 'Active and resolved incidents' },
  '/logs':       { label: 'System Logs',    sub: 'Operational event records' },
  '/devops':     { label: 'DevOps Operations', sub: 'Infrastructure & pipeline status' },
  '/admin':      { label: 'Admin Panel',    sub: 'User & system administration' },
};

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [alerts] = useState(3);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const page = routeLabels[location.pathname] || { label: 'AstroNet', sub: '' };

  return (
    <header className="flex items-center justify-between px-6 py-3 shrink-0 z-10"
      style={{
        background: 'rgba(0,0,0,0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
      }}>
      {/* Page Title */}
      <div>
        <h1 className="font-heading text-white text-base font-semibold tracking-wide">{page.label}</h1>
        <p className="text-xs text-white/40">{page.sub}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-1.5 text-xs text-mission-green/70">
          <Wifi size={13} />
          <span className="hidden sm:block font-mono">LINK ACTIVE</span>
        </div>

        {/* Clearance */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-nebula/30 bg-nebula/10">
          <Shield size={12} className="text-nebula" />
          <span className="text-xs text-nebula font-mono">LVL {user?.clearanceLevel || 2}</span>
        </div>

        {/* Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-white/5">
          <Clock size={12} className="text-cyan/70" />
          <span className="font-mono text-xs text-white/70">{format(time, 'HH:mm:ss')} UTC</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:border-cyan/40 hover:bg-cyan/5 transition-all duration-200">
          <Bell size={15} className="text-white/60" />
          {alerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: '#ff6b35', color: '#020817' }}>
              {alerts}
            </span>
          )}
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7b2fff)', color: '#020817' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name?.split(' ')[0]}</p>
            <p className="text-xs text-white/40 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
