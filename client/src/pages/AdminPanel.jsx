import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Rocket, Server, Shield, Plus, Edit2, Trash2, CheckCircle, X, Download } from 'lucide-react';
import { userAPI, missionAPI, authAPI } from '../services/api';
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

  // Modals visibility states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);

  // Edit mission tracking state
  const [editingMissionId, setEditingMissionId] = useState(null);

  // Forms state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'controller',
    department: 'Mission Control',
    clearanceLevel: 2,
  });

  const [newMissionForm, setNewMissionForm] = useState({
    name: '',
    missionId: '',
    status: 'planning',
    phase: 'Pre-Launch',
    description: '',
    objective: '',
    destination: 'Low Earth Orbit',
    vehicleType: 'Falcon-9',
    priority: 'medium',
    commander: '',
  });

  const fetchAllData = () => {
    userAPI.getAll().then(r => setUsers(r.data.data)).catch(() => {});
    missionAPI.getAll().then(r => setMissions(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const updateUserRole = async (userId, role) => {
    try {
      await userAPI.update(userId, { role });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      toast.success('User role updated');
    } catch { 
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u)); 
      toast.success('User role updated'); 
    }
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

  const handleOpenMissionModal = () => {
    const year = new Date().getFullYear();
    const count = missions.length + 1;
    const paddedCount = String(count).padStart(3, '0');
    setEditingMissionId(null);
    setNewMissionForm({
      name: '',
      missionId: `MSN-${year}-${paddedCount}`,
      status: 'planning',
      phase: 'Pre-Launch',
      description: '',
      objective: '',
      destination: 'Low Earth Orbit',
      vehicleType: 'Falcon-9',
      priority: 'medium',
      commander: users[0]?._id || '',
    });
    setShowMissionModal(true);
  };

  const handleOpenEditMissionModal = (mission) => {
    setEditingMissionId(mission._id);
    setNewMissionForm({
      name: mission.name || '',
      missionId: mission.missionId || '',
      status: mission.status || 'planning',
      phase: mission.phase || 'Pre-Launch',
      description: mission.description || '',
      objective: mission.objective || '',
      destination: mission.destination || 'Low Earth Orbit',
      vehicleType: mission.vehicleType || 'Falcon-9',
      priority: mission.priority || 'medium',
      commander: mission.commander?._id || mission.commander || '',
    });
    setShowMissionModal(true);
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.register(newUserForm);
      if (res.data?.success || res.status === 201) {
        toast.success('User registered successfully');
        fetchAllData();
        setShowUserModal(false);
        setNewUserForm({
          name: '',
          email: '',
          password: '',
          role: 'controller',
          department: 'Mission Control',
          clearanceLevel: 2,
        });
      } else {
        toast.error(res.data?.message || 'Failed to create user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleAddMissionSubmit = async (e) => {
    e.preventDefault();

    // Field validations
    if (!newMissionForm.name.trim()) {
      return toast.error('Mission Name is required');
    }
    if (!newMissionForm.missionId.trim()) {
      return toast.error('Mission ID is required');
    }
    if (!/^MSN-\d{4}-\d{3}$/.test(newMissionForm.missionId.trim())) {
      return toast.error('Mission ID must follow format MSN-YYYY-XXX (e.g. MSN-2026-005)');
    }
    if (!newMissionForm.destination.trim()) {
      return toast.error('Destination is required');
    }
    if (!newMissionForm.vehicleType.trim()) {
      return toast.error('Vehicle Type is required');
    }
    if (!newMissionForm.phase.trim()) {
      return toast.error('Phase is required');
    }
    if (!newMissionForm.objective.trim()) {
      return toast.error('Objective is required');
    }
    if (!newMissionForm.description.trim()) {
      return toast.error('Description is required');
    }

    const payload = {
      ...newMissionForm,
      name: newMissionForm.name.trim(),
      missionId: newMissionForm.missionId.trim(),
      destination: newMissionForm.destination.trim(),
      vehicleType: newMissionForm.vehicleType.trim(),
      phase: newMissionForm.phase.trim(),
      objective: newMissionForm.objective.trim(),
      description: newMissionForm.description.trim(),
      commander: newMissionForm.commander || null
    };

    try {
      let res;
      if (editingMissionId) {
        res = await missionAPI.update(editingMissionId, payload);
      } else {
        res = await missionAPI.create(payload);
      }

      if (res.data?.success || res.status === 200 || res.status === 201) {
        toast.success(editingMissionId ? 'Mission updated successfully' : 'Mission created successfully');
        fetchAllData();
        setShowMissionModal(false);
        setEditingMissionId(null);
      } else {
        toast.error(res.data?.message || 'Failed to process mission request');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing mission request');
    }
  };

  const deleteMission = async (missionId) => {
    if (!window.confirm('Are you sure you want to decommission/delete this mission?')) return;
    try {
      await missionAPI.delete(missionId);
      setMissions(missions.filter(m => m._id !== missionId));
      toast.success('Mission deleted successfully');
    } catch {
      // Fallback for mock/local data
      setMissions(missions.filter(m => m._id !== missionId));
      toast.success('Mission deleted');
    }
  };

  const deleteUser = async (userId) => {
    const currentUser = JSON.parse(localStorage.getItem('astronet_user'));
    if (userId === currentUser?._id) {
      return toast.error('Cannot delete your own administrator account');
    }
    if (!window.confirm('Are you sure you want to permanently delete this operator? This action is irreversible.')) return;
    try {
      await userAPI.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('Operator deleted successfully');
    } catch {
      setUsers(users.filter(u => u._id !== userId));
      toast.success('Operator deleted');
    }
  };

  const downloadSystemReport = () => {
    const currentUser = JSON.parse(localStorage.getItem('astronet_user'));
    const reportData = {
      title: 'ASTRONET MISSION CONTROL SYSTEM REPORT',
      timestamp: new Date().toISOString(),
      generatedBy: currentUser?.name || 'Administrator',
      systemHealth: 'NOMINAL',
      usersSummary: users.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        department: u.department,
        clearanceLevel: u.clearanceLevel
      })),
      missionsSummary: missions.map(m => ({
        name: m.name,
        missionId: m.missionId,
        status: m.status,
        destination: m.destination,
        vehicleType: m.vehicleType,
        priority: m.priority,
        healthScore: m.healthScore,
        fuelLevel: m.fuelLevel
      })),
      microservicesStatus: serviceHealth
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astronet-system-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('System report downloaded');
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
      {/* Header with Download Report */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider">Control Station Admin</h2>
          <p className="text-xs text-white/45">Manage operators, launch missions, and monitor microservices.</p>
        </div>
        <button onClick={downloadSystemReport} className="btn-secondary py-2 px-4 text-xs flex items-center gap-2 max-w-max self-start sm:self-auto">
          <Download size={14} /> DOWNLOAD SYSTEM REPORT
        </button>
      </div>

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
            <button onClick={() => setShowUserModal(true)} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
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
                          className="w-7 h-7 rounded flex items-center justify-center border border-white/10 hover:border-cyan/40 hover:bg-cyan/5 text-white/40 hover:text-cyan transition-all"
                          title="Edit User Role"
                        >
                          <Edit2 size={12} />
                        </button>
                        
                        {u.status === 'active' ? (
                          <button onClick={() => toggleUserStatus(u._id, u.status)}
                            className="w-7 h-7 rounded flex items-center justify-center border border-rocket/30 hover:bg-rocket/10 text-rocket/60 hover:text-rocket transition-all"
                            title="Suspend User"
                          >
                            <Trash2 size={12} />
                          </button>
                        ) : (
                          <>
                            <button onClick={() => toggleUserStatus(u._id, u.status)}
                              className="w-7 h-7 rounded flex items-center justify-center border border-mission-green/30 hover:bg-mission-green/10 text-mission-green transition-all"
                              title="Revoke Suspension (Activate)"
                            >
                              <CheckCircle size={12} />
                            </button>
                            <button onClick={() => deleteUser(u._id)}
                              className="w-7 h-7 rounded flex items-center justify-center border border-red-500/30 hover:bg-red-500/10 text-red-500 transition-all"
                              title="Permanently Delete Operator"
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
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
            <button onClick={handleOpenMissionModal} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
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
                  <button onClick={() => handleOpenEditMissionModal(m)} className="w-7 h-7 rounded flex items-center justify-center border border-white/10 hover:border-cyan/40 text-white/40 hover:text-cyan transition-all" title="Edit Mission Details"><Edit2 size={12} /></button>
                  <button onClick={() => deleteMission(m._id)} className="w-7 h-7 rounded flex items-center justify-center border border-rocket/20 hover:border-rocket/40 text-rocket/40 hover:text-rocket transition-all"><Trash2 size={12} /></button>
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

      {/* Modals rendering */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card-cyan p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
                <h3 className="font-heading text-lg font-bold text-white">ADD NEW OPERATOR</h3>
                <button onClick={() => setShowUserModal(false)} className="text-white/40 hover:text-white/80 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">FULL NAME</label>
                  <input 
                    type="text" 
                    value={newUserForm.name} 
                    required 
                    onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="input-space"
                    placeholder="e.g. Dr. Sarah Mitchell"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">OPERATOR ID (EMAIL)</label>
                  <input 
                    type="email" 
                    value={newUserForm.email} 
                    required 
                    onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="input-space"
                    placeholder="operator@astronet.io"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">ACCESS CODE (PASSWORD)</label>
                  <input 
                    type="password" 
                    value={newUserForm.password} 
                    required 
                    onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="input-space"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">ROLE</label>
                    <select 
                      value={newUserForm.role}
                      onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      className="input-space py-2.5"
                    >
                      <option value="admin">Admin</option>
                      <option value="controller">Controller</option>
                      <option value="analyst">Analyst</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">CLEARANCE LEVEL</label>
                    <select 
                      value={newUserForm.clearanceLevel}
                      onChange={e => setNewUserForm({ ...newUserForm, clearanceLevel: parseInt(e.target.value) })}
                      className="input-space py-2.5"
                    >
                      <option value={1}>1 - Restricted</option>
                      <option value={2}>2 - Standard</option>
                      <option value={3}>3 - Elevated</option>
                      <option value={4}>4 - High</option>
                      <option value={5}>5 - Maximum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">DEPARTMENT</label>
                  <input 
                    type="text" 
                    value={newUserForm.department} 
                    onChange={e => setNewUserForm({ ...newUserForm, department: e.target.value })}
                    className="input-space"
                    placeholder="e.g. Mission Control"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowUserModal(false)} className="btn-secondary py-2 px-4 text-xs">
                    CANCEL
                  </button>
                  <button type="submit" className="btn-primary py-2 px-4 text-xs">
                    CREATE OPERATOR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showMissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card-cyan p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
                <h3 className="font-heading text-lg font-bold text-white">
                  {editingMissionId ? 'EDIT OPERATIONAL MISSION' : 'LAUNCH NEW MISSION'}
                </h3>
                <button onClick={() => setShowMissionModal(false)} className="text-white/40 hover:text-white/80 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMissionSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">MISSION NAME</label>
                    <input 
                      type="text" 
                      value={newMissionForm.name} 
                      required 
                      onChange={e => setNewMissionForm({ ...newMissionForm, name: e.target.value })}
                      className="input-space"
                      placeholder="e.g. ODYSSEY-I"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">MISSION ID</label>
                    <input 
                      type="text" 
                      value={newMissionForm.missionId} 
                      required 
                      disabled={!!editingMissionId}
                      onChange={e => setNewMissionForm({ ...newMissionForm, missionId: e.target.value })}
                      className="input-space font-mono text-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g. MSN-2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">DESTINATION</label>
                    <input 
                      type="text" 
                      value={newMissionForm.destination} 
                      required
                      onChange={e => setNewMissionForm({ ...newMissionForm, destination: e.target.value })}
                      className="input-space"
                      placeholder="e.g. Mars Orbit"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">VEHICLE TYPE</label>
                    <input 
                      type="text" 
                      value={newMissionForm.vehicleType} 
                      required
                      onChange={e => setNewMissionForm({ ...newMissionForm, vehicleType: e.target.value })}
                      className="input-space"
                      placeholder="e.g. Falcon Heavy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">STATUS</label>
                    <select 
                      value={newMissionForm.status}
                      onChange={e => setNewMissionForm({ ...newMissionForm, status: e.target.value })}
                      className="input-space py-2.5"
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="standby">Standby</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">PRIORITY</label>
                    <select 
                      value={newMissionForm.priority}
                      onChange={e => setNewMissionForm({ ...newMissionForm, priority: e.target.value })}
                      className="input-space py-2.5"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/55 mb-1.5 font-mono">PHASE</label>
                    <input 
                      type="text" 
                      value={newMissionForm.phase}
                      required
                      onChange={e => setNewMissionForm({ ...newMissionForm, phase: e.target.value })}
                      className="input-space"
                      placeholder="Pre-Launch"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">COMMANDER</label>
                  <select 
                    value={newMissionForm.commander}
                    onChange={e => setNewMissionForm({ ...newMissionForm, commander: e.target.value })}
                    className="input-space py-2.5"
                  >
                    <option value="">No Commander Assigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">OBJECTIVE</label>
                  <input 
                    type="text" 
                    value={newMissionForm.objective}
                    required
                    onChange={e => setNewMissionForm({ ...newMissionForm, objective: e.target.value })}
                    className="input-space"
                    placeholder="Brief summary of mission goals"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/55 mb-1.5 font-mono">DESCRIPTION</label>
                  <textarea 
                    value={newMissionForm.description}
                    required
                    onChange={e => setNewMissionForm({ ...newMissionForm, description: e.target.value })}
                    className="input-space min-h-[80px]"
                    placeholder="Detailed description of the mission..."
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowMissionModal(false)} className="btn-secondary py-2 px-4 text-xs">
                    CANCEL
                  </button>
                  <button type="submit" className="btn-primary py-2 px-4 text-xs">
                    {editingMissionId ? 'SAVE CHANGES' : 'LAUNCH MISSION'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
