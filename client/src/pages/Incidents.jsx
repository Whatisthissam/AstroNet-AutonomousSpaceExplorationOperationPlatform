import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Filter, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { incidentAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const mockIncidents = [
  { _id: '1', title: 'EUROPA-II Communication Degradation', description: 'Primary antenna pointing error, signal degraded to 67%.', severity: 'critical', status: 'investigating', missionName: 'EUROPA-II', affectedSystem: 'Communication Array', category: 'communication', impactScore: 9, assignedToName: 'Dr. J. Rodriguez', recoveryActions: ['Activate backup antenna', 'Recompute pointing vector', 'Schedule maintenance window'], createdAt: new Date(Date.now() - 7200000), timeline: [{ action: 'Anomaly detected', actor: 'EUROPA-AI', time: new Date(Date.now() - 7200000) }, { action: 'Incident escalated', actor: 'System', time: new Date(Date.now() - 6800000) }, { action: 'Team assigned', actor: 'Dr. J. Rodriguez', time: new Date(Date.now() - 5400000) }] },
  { _id: '2', title: 'ARES-VII Thermal Sensor Spike', description: 'Sensor T-7 reported abnormal temperature during solar exposure.', severity: 'medium', status: 'active', missionName: 'ARES-VII', affectedSystem: 'Thermal Management', category: 'hardware', impactScore: 5, assignedToName: 'Dr. A. Chen', recoveryActions: ['Cross-reference redundant sensors', 'Adjust thermal shielding'], createdAt: new Date(Date.now() - 3600000), timeline: [{ action: 'Sensor alert triggered', actor: 'ARES-VII', time: new Date(Date.now() - 3600000) }] },
  { _id: '3', title: 'Ground Station DS-47 Power Interruption', description: '12-minute power outage at Deep Space Station 47.', severity: 'high', status: 'resolved', missionName: 'All Active Missions', affectedSystem: 'Ground Infrastructure', category: 'power', impactScore: 7, assignedToName: 'Capt. L. Nakamura', recoveryActions: ['Switch to backup generators', 'Re-establish contact'], resolvedAt: new Date(Date.now() - 1800000), createdAt: new Date(Date.now() - 5400000), timeline: [{ action: 'Power failure', actor: 'Monitor', time: new Date(Date.now() - 5400000) }, { action: 'Resolved', actor: 'Capt. Nakamura', time: new Date(Date.now() - 1800000) }] },
];

const severityColors = {
  critical: 'text-rocket border-rocket/30 bg-rocket/10',
  high:     'text-mission-gold border-mission-gold/30 bg-mission-gold/10',
  medium:   'text-cyan border-cyan/30 bg-cyan/10',
  low:      'text-mission-green border-mission-green/30 bg-mission-green/10',
};

export default function Incidents() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    incidentAPI.getAll().then(r => setIncidents(r.data.data)).catch(() => {});
  }, []);

  const filtered = incidents.filter(i => filter === 'all' ? true : i.status === filter || i.severity === filter);
  const active = incidents.filter(i => ['active', 'investigating'].includes(i.status)).length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;

  const resolve = async (id) => {
    try {
      await incidentAPI.update(id, { status: 'resolved' });
      setIncidents(incidents.map(i => i._id === id ? { ...i, status: 'resolved', resolvedAt: new Date() } : i));
      toast.success('Incident resolved');
    } catch { setIncidents(incidents.map(i => i._id === id ? { ...i, status: 'resolved', resolvedAt: new Date() } : i)); toast.success('Incident resolved'); }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', value: active, color: 'text-rocket', icon: AlertTriangle },
          { label: 'Total', value: incidents.length, color: 'text-cyan', icon: Filter },
          { label: 'Resolved', value: resolved, color: 'text-mission-green', icon: CheckCircle },
        ].map((s) => (
          <GlassCard key={s.label} className="p-5" animate={false}>
            <div className="flex items-center gap-3">
              <s.icon size={20} className={s.color} />
              <div>
                <div className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-white/40">{s.label} Incidents</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'investigating', 'resolved', 'critical', 'high', 'medium'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 capitalize ${filter === f ? 'border-cyan bg-cyan/15 text-cyan' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filtered.map((inc) => (
          <GlassCard key={inc._id} className="overflow-hidden" animate={false}>
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Severity indicator */}
                <div className={`w-1 self-stretch rounded-full ${inc.severity === 'critical' ? 'bg-rocket' : inc.severity === 'high' ? 'bg-mission-gold' : inc.severity === 'medium' ? 'bg-cyan' : 'bg-mission-green'}`} />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{inc.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                        <span>{inc.missionName}</span>
                        <span>•</span>
                        <span>{inc.affectedSystem}</span>
                        <span>•</span>
                        <span>{inc.createdAt ? format(new Date(inc.createdAt), 'MMM d, HH:mm') : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${severityColors[inc.severity]}`}>
                        {inc.severity?.toUpperCase()}
                      </span>
                      <StatusBadge status={inc.status} />
                    </div>
                  </div>

                  <p className="text-sm text-white/55 mb-3">{inc.description}</p>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/30">👤 {inc.assignedToName}</span>
                    <span className="text-xs text-white/30">Impact: {inc.impactScore}/10</span>
                    {inc.status !== 'resolved' && (
                      <button onClick={() => resolve(inc._id)} className="ml-auto px-3 py-1 rounded-lg bg-mission-green/10 border border-mission-green/30 text-mission-green text-xs font-semibold hover:bg-mission-green/20 transition-colors">
                        ✓ Mark Resolved
                      </button>
                    )}
                    <button onClick={() => setExpanded(expanded === inc._id ? null : inc._id)}
                      className="ml-auto flex items-center gap-1 text-xs text-cyan/60 hover:text-cyan transition-colors">
                      Timeline {expanded === inc._id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <AnimatePresence>
              {expanded === inc._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 px-5 pb-5 pt-4 bg-white/[0.02]">
                  <div className="flex gap-4 mb-4">
                    {/* Recovery Actions */}
                    <div className="flex-1">
                      <p className="text-xs text-white/40 mb-2 font-mono">RECOVERY ACTIONS</p>
                      <div className="space-y-1.5">
                        {inc.recoveryActions?.map((a, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                            <div className="w-4 h-4 rounded border border-cyan/30 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan/60" />
                            </div>
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Timeline */}
                    <div className="flex-1">
                      <p className="text-xs text-white/40 mb-2 font-mono">EVENT TIMELINE</p>
                      <div className="space-y-2">
                        {inc.timeline?.map((t, i) => (
                          <div key={i} className="flex gap-3 text-xs">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-cyan mt-0.5 shrink-0" />
                              {i < inc.timeline.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                            </div>
                            <div className="pb-2">
                              <span className="text-white/60">{t.action}</span>
                              <span className="text-white/30 ml-2">— {t.actor}</span>
                              <div className="text-white/20 mt-0.5">{t.time ? format(new Date(t.time), 'HH:mm:ss') : ''}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
