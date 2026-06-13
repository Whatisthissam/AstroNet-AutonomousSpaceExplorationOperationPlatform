import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Satellite, BarChart3, AlertTriangle,
  ScrollText, Server, ShieldCheck, ChevronLeft, ChevronRight,
  Rocket, LogOut, User, Settings, Zap
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Mission Control', icon: LayoutDashboard, color: 'cyan' },
  { path: '/telemetry',  label: 'Telemetry',       icon: Satellite,       color: 'green' },
  { path: '/analytics',  label: 'Analytics',        icon: BarChart3,       color: 'nebula' },
  { path: '/incidents',  label: 'Incidents',         icon: AlertTriangle,   color: 'rocket' },
  { path: '/logs',       label: 'System Logs',       icon: ScrollText,      color: 'gold' },
  { path: '/devops',     label: 'DevOps Ops',        icon: Server,          color: 'cyan' },
];

const colorMap = {
  cyan:   { active: 'text-cyan border-cyan bg-cyan/10',   hover: 'hover:text-cyan hover:border-cyan/50 hover:bg-cyan/5' },
  green:  { active: 'text-mission-green border-mission-green bg-mission-green/10', hover: 'hover:text-mission-green hover:border-mission-green/50 hover:bg-mission-green/5' },
  nebula: { active: 'text-nebula border-nebula bg-nebula/10', hover: 'hover:text-nebula hover:border-nebula/50 hover:bg-nebula/5' },
  rocket: { active: 'text-rocket border-rocket bg-rocket/10', hover: 'hover:text-rocket hover:border-rocket/50 hover:bg-rocket/5' },
  gold:   { active: 'text-mission-gold border-mission-gold bg-mission-gold/10', hover: 'hover:text-mission-gold hover:border-mission-gold/50 hover:bg-mission-gold/5' },
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden z-20"
      style={{
        background: 'linear-gradient(180deg, rgba(7,7,10,0.98) 0%, rgba(0,0,0,0.98) 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #7b2fff)', boxShadow: '0 0 15px rgba(0,212,255,0.4)' }}>
          <Rocket size={18} className="text-space-900" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <p className="font-heading text-white text-sm font-bold leading-tight">ASTRONET</p>
              <p className="text-xs text-cyan/60 tracking-widest">MISSION CTRL</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)}
          className="ml-auto w-7 h-7 rounded-md flex items-center justify-center border border-white/10 text-white/40 hover:text-cyan hover:border-cyan/40 transition-all duration-200">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Status indicator */}
      <div className={`flex items-center gap-2 px-4 py-2 ${collapsed ? 'justify-center' : ''}`}>
        <div className="pulse-dot pulse-dot-green"><span /></div>
        {!collapsed && <span className="text-xs text-mission-green/70 font-mono">SYSTEMS NOMINAL</span>}
      </div>

      <div className="divider-glow mx-4 mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <AnimatePresence>
          {!collapsed && <p className="px-2 pb-1 section-label">Navigation</p>}
        </AnimatePresence>
        {navItems.map((item) => {
          const colors = colorMap[item.color];
          return (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 group
                ${isActive
                  ? `${colors.active} border-l-2`
                  : `border-transparent text-white/50 ${colors.hover}`
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}

        {isAdmin && (
          <>
            <div className="divider-glow my-2" />
            <AnimatePresence>
              {!collapsed && <p className="px-2 pb-1 section-label">Administration</p>}
            </AnimatePresence>
            <NavLink to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200
                ${isActive ? 'text-nebula border-l-2 border-nebula bg-nebula/10' : 'border-transparent text-white/50 hover:text-nebula hover:bg-nebula/5'}
                ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? 'Admin Panel' : undefined}
            >
              <ShieldCheck size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium">Admin Panel</motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/5">
        <div className={`flex items-center gap-3 p-2 rounded-lg bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #00d4ff33, #7b2fff33)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <User size={14} className="text-cyan" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name?.split(' ').slice(-1)[0] || 'User'}</p>
                <p className="text-xs text-white/40 capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={handleLogout}
            className="w-7 h-7 flex items-center justify-center rounded-md text-white/30 hover:text-rocket hover:bg-rocket/10 transition-all duration-200"
            title="Logout">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
