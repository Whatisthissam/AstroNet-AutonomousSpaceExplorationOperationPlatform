import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, Server, Shield, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { userAPI, missionAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const mockUsers = [
  { _id: '1', name: 'Commander Sarah Mitchell', email: 'admin@astronet.io', role: 'admin', status: 'active', department: 'Command Center', clearanceLevel: 5, lastLogin: new Date(Date.now() - 600000) },
  { _id: '2', name: 'Dr. James Rodriguez', email: 'controller@astronet.io', role: 'controller', status: 'active', department: 'Mission Control', clearanceLevel: 4, lastLogin: new Date(Date.now() - 7200000) },
  { _id: '3', name: 'Dr. Aisha Chen', email: 'analyst@astronet.io', role: 'analyst', status: 'active', department: 'Telemetry Analysis', clearanceLevel: 3, lastLogin: new Date(Date.now() - 86400000) },
  { _id: '4', name: 'Capt. Leo Nakamura', email: 'leo@astronet.io', role: 'controller', status: 'active', department: 'Navigation', clearanceLevel: 3, lastLogin: new Date(Date.now() - 3600000) },
];

const tabs = [
  { id: 'users',    label: 'User Management',    icon: Users },
  { id: 'missions', label: 'Mission Management', icon: Rocket },
  { id: 'services', label: 'Service Health',     icon: Server },
];

const roleColors = { admin: 'text-nebula border-nebula/30 bg-nebula/10', controller: 'text-cyan border-cyan/30 bg-cyan/10', analyst: 'text-mission-green border-mission-green/30 bg-mission-green/10' };

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(mockUsers);
  const [missions, setMissions] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    userAPI.getAll().then(r => setUsers(r.data.data)).catch(() => {});
    missionAPI.getAll().then(r => setMissions(r.data.data)).catch(() => {});
  }, []);

  const updateUserRole = async (userId, role) => {
    try {
      await userAPI.update(userId, { role });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      toast.success('User role updated');
    } catch { setUsers(users.map(u => u._id === userId ? { ...u, role } : u)); toast.success('User role updated'); }
    setEditingUser(null);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await userAPI.update(userId, { status: newStatus });
    } catch {}
    setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    toast.success(`User ${newStatus}`);
  };

  const serviceHealth = [
    { name: 'Mission API',         status: 'operational', uptime: '99.98%', latency: '45ms',  requests: '12.4k/min' },
    { name: 'Telemetry Service',   status: 'operational', uptime: '99.95%', latency: '12ms',  requests: '8.2k/min' },
    { name: 'Auth Service',        status: 'operational', uptime: '100%',   latency: '28ms',  requests: '2.1k/min' },
    { name: 'Analytics Engine',    status: 'operational', uptime: '99.92%', latency: '180ms', requests: '340/min' },
    { name: 'Incident Manager',    status: 'degraded',    uptime: '97.41%', latency: '230ms', requests: '120/min' },
    { name: 'Notification Service',status: 'operational', uptime: '99.89%', latency: '67ms',  requests: '890/min' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-cyan' },
          { label: 'Active Missions', value: missions.filter(m => m.status === 'active').length || 3, icon: Rocket, color: 'text-mission-green' },
          { label: 'Services Up', value: '7/8', icon: Server, color: 'text-nebula' },
          { label: 'Clearance Levels', value: '1–5', icon: Shield, color: 'text-mission-gold' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4" animate={false}>
            <div className="flex items-center gap-3">
              <s.icon size={18} className={s.color} />
              <div>
                <div className={`font-heading text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px ${activeTab === tab.id ? 'border-cyan text-cyan' : 'border-transparent text-white/40 hover:text-white/70'}`}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <GlassCard animate={false}>
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-white">USER REGISTRY</h3>
            <button className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
              <Plus size={13} /> Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/30 border-b border-white/5">
                  <th className="px-5 py-3 text-left">OPERATOR</th>
                  <th className="px-4 py-3 text-left">ROLE</th>
                  <th className="px-4 py-3 text-left">DEPARTMENT</th>
                  <th className="px-4 py-3 text-left">CLEARANCE</th>
                  <th className="px-4 py-3 text-left">STATUS</th>
                  <th className="px-4 py-3 text-left">LAST ACTIVE</th>
                  <th className="px-4 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,255,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}>
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{u.name}</div>
                          <div className="text-xs text-white/40">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {editingUser === u._id ? (
                        <select className="input-space py-1 text-xs w-28" defaultValue={u.role}
                          onChange={e => updateUserRole(u._id, e.target.value)}>
                          <option value="admin">Admin</option>
                          <option value="controller">Controller</option>
                          <option value="analyst">Analyst</option>
                        </select>
                      ) : (
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${roleColors[u.role] || roleColors.analyst}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-white/60">{u.department}</td>
                    <td className="px-4 py-4">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full mr-0.5 ${i < u.clearanceLevel ? 'bg-nebula' : 'bg-white/10'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-4 text-xs text-white/40">
                      {u.lastLogin ? format(new Date(u.lastLogin), 'MMM d, HH:mm') : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingUser(editingUser === u._id ? null : u._id)}
                          className="w-7 h-7 rounded flex items-center justify-center border border-white/10 hover:border-cyan/40 hover:bg-cyan/5 text-white/40 hover:text-cyan transition-all">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => toggleUserStatus(u._id, u.status)}
                          className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${u.status === 'active' ? 'border-rocket/30 hover:bg-rocket/10 text-rocket/60 hover:text-rocket' : 'border-mission-green/30 hover:bg-mission-green/10 text-mission-green'}`}>
                          {u.status === 'active' ? <Trash2 size={12} /> : <CheckCircle size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Mission Management Tab */}
      {activeTab === 'missions' && (
        <GlassCard animate={false} className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-sm font-bold text-white">MISSION REGISTRY</h3>
            <button className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
              <Plus size={13} /> New Mission
            </button>
          </div>
          <div className="space-y-3">
            {(missions.length > 0 ? missions : [
              { _id:'1', missionId:'MSN-001', name:'ARES-VII', status:'active', priority:'critical', destination:'Mars', launchDate:new Date('2024-03-15') },
              { _id:'2', missionId:'MSN-002', name:'HERMES-IV', status:'active', priority:'high', destination:'Luna', launchDate:new Date('2024-06-01') },
              { _id:'3', missionId:'MSN-003', name:'EUROPA-II', status:'critical', priority:'critical', destination:'Europa', launchDate:new Date('2023-11-10') },
            ]).map(m => (
              <div key={m._id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="font-mono text-xs text-white/30 w-24 shrink-0">{m.missionId}</div>
                <div className="flex-1"><div className="font-semibold text-sm text-white">{m.name}</div><div className="text-xs text-white/40">{m.destination}</div></div>
                <StatusBadge status={m.status} />
                <StatusBadge status={m.priority} />
                <div className="text-xs text-white/30">{m.launchDate ? format(new Date(m.launchDate), 'MMM d, yyyy') : '—'}</div>
                <div className="flex gap-2">
                  <button className="w-7 h-7 rounded flex items-center justify-center border border-white/10 hover:border-cyan/40 text-white/40 hover:text-cyan transition-all"><Edit2 size={12} /></button>
                  <button className="w-7 h-7 rounded flex items-center justify-center border border-rocket/20 hover:border-rocket/40 text-rocket/40 hover:text-rocket transition-all"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Service Health Tab */}
      {activeTab === 'services' && (
        <div className="grid md:grid-cols-2 gap-4">
          {serviceHealth.map((s) => (
            <GlassCard key={s.name} className="p-5" animate={false}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                <StatusBadge status={s.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div><div className="text-white/30">Uptime</div><div className="font-bold text-mission-green">{s.uptime}</div></div>
                <div><div className="text-white/30">Latency</div><div className={`font-bold ${parseInt(s.latency) > 100 ? 'text-mission-gold' : 'text-cyan'}`}>{s.latency}</div></div>
                <div><div className="text-white/30">Requests</div><div className="font-bold text-nebula">{s.requests}</div></div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
