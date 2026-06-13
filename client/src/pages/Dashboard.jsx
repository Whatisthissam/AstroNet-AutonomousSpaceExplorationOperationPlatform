import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, AlertTriangle, CheckCircle, Activity, Satellite, Wifi, Zap, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { missionAPI, incidentAPI, telemetryAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { format } from 'date-fns';

const mockMissions = [
  { _id: '1', name: 'ARES-VII', missionId: 'MSN-2024-001', status: 'active', healthScore: 94, fuelLevel: 72, communicationStatus: 'nominal', satelliteConnectivity: 98, destination: 'Mars', phase: 'Orbital Insertion', priority: 'critical' },
  { _id: '2', name: 'HERMES-IV', missionId: 'MSN-2024-002', status: 'active', healthScore: 88, fuelLevel: 61, communicationStatus: 'nominal', satelliteConnectivity: 95, destination: 'Luna', phase: 'Trans-Lunar', priority: 'high' },
  { _id: '3', name: 'EUROPA-II', missionId: 'MSN-2024-003', status: 'critical', healthScore: 61, fuelLevel: 48, communicationStatus: 'degraded', satelliteConnectivity: 67, destination: 'Europa', phase: 'Jupiter Approach', priority: 'critical' },
  { _id: '4', name: 'SOLAR WATCH-I', missionId: 'MSN-2024-004', status: 'standby', healthScore: 100, fuelLevel: 100, communicationStatus: 'standby', satelliteConnectivity: 100, destination: 'L1', phase: 'Pre-Launch', priority: 'high' },
];

const mockAlerts = [
  { id: 1, msg: 'EUROPA-II antenna pointing error detected', severity: 'critical', time: '2m ago' },
  { id: 2, msg: 'ARES-VII thermal sensor spike on T-7', severity: 'medium', time: '18m ago' },
  { id: 3, msg: 'Ground Station DS-47 power restored', severity: 'info', time: '1h ago' },
  { id: 4, msg: 'HERMES-IV course correction burn successful', severity: 'success', time: '2h ago' },
];

const mockTelemetry = [
  { time: '15:42:01', source: 'ARES-VII', msg: 'Telemetry nominal — alt 258km', level: 'INFO' },
  { time: '15:41:48', source: 'EUROPA-II', msg: 'Signal strength 67% — degraded', level: 'WARN' },
  { time: '15:41:30', source: 'HERMES-IV', msg: 'Fuel 61% — burn complete', level: 'INFO' },
  { time: '15:41:12', source: 'System', msg: 'Incident INC-001 escalated', level: 'ERROR' },
  { time: '15:40:55', source: 'ARES-VII', msg: 'Science packet 847MB received', level: 'INFO' },
];

const alertColors = { critical: 'text-rocket border-rocket/30 bg-rocket/10', medium: 'text-mission-gold border-mission-gold/30 bg-mission-gold/10', info: 'text-cyan border-cyan/30 bg-cyan/10', success: 'text-mission-green border-mission-green/30 bg-mission-green/10' };
const logColors = { INFO: 'text-cyan', WARN: 'text-mission-gold', ERROR: 'text-rocket', CRITICAL: 'text-rocket' };

export default function Dashboard() {
  const [missions, setMissions] = useState(mockMissions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    missionAPI.getAll().then(r => setMissions(r.data.data)).catch(() => setMissions(mockMissions));
  }, []);

  const stats = {
    total: missions.length,
    active: missions.filter(m => m.status === 'active').length,
    critical: missions.filter(m => m.status === 'critical').length,
    avgHealth: missions.length ? Math.round(missions.reduce((s, m) => s + (m.healthScore || 0), 0) / missions.length) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'Total Missions', value: stats.total,    icon: Rocket,        color: 'cyan',   sub: 'All missions' },
          { label: 'Active',         value: stats.active,   icon: Activity,      color: 'green',  sub: 'Currently flying' },
          { label: 'Critical',       value: stats.critical, icon: AlertTriangle, color: 'rocket', sub: 'Need attention' },
          { label: 'Fleet Health',   value: `${stats.avgHealth}%`, icon: TrendingUp, color: 'nebula', sub: 'Average score' },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-white/40 font-mono mb-1">{s.label.toUpperCase()}</p>
                <p className={`font-heading text-3xl font-bold text-${s.color === 'cyan' ? 'cyan' : s.color === 'green' ? 'mission-green' : s.color === 'rocket' ? 'rocket' : 'nebula'}`}>{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${s.color}/10 border border-${s.color}/20`}>
                <s.icon size={18} className={`text-${s.color === 'cyan' ? 'cyan' : s.color === 'green' ? 'mission-green' : s.color === 'rocket' ? 'rocket' : 'nebula'}`} />
              </div>
            </div>
            <p className="text-xs text-white/30">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Missions - 2/3 */}
        <div className="lg:col-span-2">
          <GlassCard className="p-5" animate={false}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-sm font-bold text-white tracking-wide">MISSION STATUS BOARD</h2>
              <div className="flex items-center gap-1.5 text-xs text-cyan/60">
                <div className="pulse-dot pulse-dot-green"><span /></div>
                <span>Live</span>
              </div>
            </div>

            <div className="space-y-3">
              {missions.map((m) => (
                <div key={m._id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-200">
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'active' ? 'bg-mission-green animate-pulse' : m.status === 'critical' ? 'bg-rocket animate-pulse' : m.status === 'standby' ? 'bg-mission-gold' : 'bg-cyan'}`} />

                  {/* Mission info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading text-sm font-bold text-white">{m.name}</span>
                      <StatusBadge status={m.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{m.destination}</span>
                      <span>•</span>
                      <span>{m.phase}</span>
                    </div>
                  </div>

                  {/* Health score */}
                  <div className="text-center hidden md:block">
                    <div className={`font-heading text-lg font-bold ${m.healthScore >= 80 ? 'text-mission-green' : m.healthScore >= 60 ? 'text-mission-gold' : 'text-rocket'}`}>{m.healthScore}%</div>
                    <div className="text-xs text-white/30">Health</div>
                  </div>

                  {/* Fuel */}
                  <div className="hidden lg:block w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">Fuel</span>
                      <span className="text-white/60">{m.fuelLevel}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`h-full rounded-full ${m.fuelLevel > 60 ? 'progress-fill-green' : m.fuelLevel > 30 ? 'progress-fill-gold' : 'progress-fill-rocket'}`}
                        style={{ width: `${m.fuelLevel}%` }} />
                    </div>
                  </div>

                  {/* Comm status */}
                  <div className="shrink-0">
                    <StatusBadge status={m.communicationStatus} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Alert Center - 1/3 */}
        <div className="space-y-4">
          <GlassCard className="p-5" animate={false}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-rocket" />
              <h2 className="font-heading text-sm font-bold text-white">ALERT CENTER</h2>
              <span className="ml-auto bg-rocket/20 text-rocket text-xs px-2 py-0.5 rounded-full border border-rocket/30">
                {mockAlerts.filter(a => a.severity === 'critical').length} CRITICAL
              </span>
            </div>
            <div className="space-y-2">
              {mockAlerts.map((a) => (
                <div key={a.id} className={`flex gap-3 p-3 rounded-lg border text-xs ${alertColors[a.severity]}`}>
                  <div className="flex-1">{a.msg}</div>
                  <div className="text-white/30 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Connectivity */}
          <GlassCard className="p-5" animate={false}>
            <div className="flex items-center gap-2 mb-4">
              <Wifi size={16} className="text-cyan" />
              <h2 className="font-heading text-sm font-bold text-white">CONNECTIVITY</h2>
            </div>
            <div className="space-y-3">
              {missions.slice(0, 3).map(m => (
                <div key={m._id} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${m.satelliteConnectivity >= 90 ? 'bg-mission-green' : m.satelliteConnectivity >= 70 ? 'bg-mission-gold' : 'bg-rocket'}`} />
                  <span className="text-xs text-white/60 flex-1">{m.name}</span>
                  <span className={`text-xs font-mono ${m.satelliteConnectivity >= 90 ? 'text-mission-green' : m.satelliteConnectivity >= 70 ? 'text-mission-gold' : 'text-rocket'}`}>
                    {m.satelliteConnectivity}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Telemetry Feed */}
      <GlassCard className="p-5" animate={false}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-cyan" />
          <h2 className="font-heading text-sm font-bold text-white">LIVE TELEMETRY FEED</h2>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-mission-green/60">
            <div className="pulse-dot pulse-dot-green"><span /></div>
            <span>Streaming</span>
          </div>
        </div>
        <div className="space-y-1.5 font-mono text-xs">
          {mockTelemetry.map((t, i) => (
            <div key={i} className="flex gap-4 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <span className="text-white/30 shrink-0">{t.time}</span>
              <span className={`shrink-0 w-14 text-right ${logColors[t.level] || 'text-white/60'}`}>[{t.level}]</span>
              <span className="text-cyan/70 shrink-0 w-20">{t.source}</span>
              <span className="text-white/60">{t.msg}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
