import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';
import { logAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import { format } from 'date-fns';

const mockLogs = [
  { _id: '1', message: 'System startup complete — All services nominal', level: 'INFO', source: 'System', component: 'Core', timestamp: new Date(Date.now() - 600000) },
  { _id: '2', message: 'ARES-VII telemetry packet received — 2048 bytes', level: 'INFO', source: 'Telemetry', component: 'Receiver', timestamp: new Date(Date.now() - 720000) },
  { _id: '3', message: 'EUROPA-II signal strength dropped below threshold (67%)', level: 'WARN', source: 'Communication', component: 'Signal Monitor', timestamp: new Date(Date.now() - 900000) },
  { _id: '4', message: 'Authentication attempt from unknown IP: 192.168.1.105', level: 'WARN', source: 'Security', component: 'Auth Guard', timestamp: new Date(Date.now() - 1200000) },
  { _id: '5', message: 'HERMES-IV course correction burn completed successfully', level: 'INFO', source: 'Navigation', component: 'Propulsion', timestamp: new Date(Date.now() - 1800000) },
  { _id: '6', message: 'Database backup completed — 4.2GB archived', level: 'INFO', source: 'Database', component: 'Backup', timestamp: new Date(Date.now() - 2400000) },
  { _id: '7', message: 'EUROPA-II primary antenna pointing error detected', level: 'ERROR', source: 'Communication', component: 'Antenna Control', timestamp: new Date(Date.now() - 3000000) },
  { _id: '8', message: 'Incident INC-2024-001 escalated to CRITICAL severity', level: 'CRITICAL', source: 'Incident Management', component: 'Escalation', timestamp: new Date(Date.now() - 3600000) },
  { _id: '9', message: 'Docker container mission-api restarted (OOMKilled)', level: 'ERROR', source: 'Infrastructure', component: 'Docker', timestamp: new Date(Date.now() - 4200000) },
  { _id: '10', message: 'Jenkins pipeline astronet-deploy #1287 completed: SUCCESS', level: 'INFO', source: 'CI/CD', component: 'Jenkins', timestamp: new Date(Date.now() - 4800000) },
  { _id: '11', message: 'Kubernetes node worker-3 memory usage at 89%', level: 'WARN', source: 'Infrastructure', component: 'Kubernetes', timestamp: new Date(Date.now() - 5400000) },
  { _id: '12', message: 'Vault token rotated for service: telemetry-processor', level: 'INFO', source: 'Security', component: 'Vault', timestamp: new Date(Date.now() - 6000000) },
  { _id: '13', message: 'Prometheus alert: High CPU on mission-api pod', level: 'WARN', source: 'Monitoring', component: 'Prometheus', timestamp: new Date(Date.now() - 6600000) },
  { _id: '14', message: 'Solar flare activity detected — communication windows adjusted', level: 'WARN', source: 'Space Weather', component: 'Solar Monitor', timestamp: new Date(Date.now() - 7200000) },
  { _id: '15', message: 'ARES-VII science data package received — 847MB', level: 'INFO', source: 'Data Processing', component: 'Science Pipeline', timestamp: new Date(Date.now() - 7800000) },
];

const levelConfig = {
  INFO:     { cls: 'text-cyan bg-cyan/10 border-cyan/30',                label: 'INFO' },
  WARN:     { cls: 'text-mission-gold bg-mission-gold/10 border-mission-gold/30', label: 'WARN' },
  ERROR:    { cls: 'text-rocket bg-rocket/10 border-rocket/30',          label: 'ERROR' },
  CRITICAL: { cls: 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse', label: 'CRIT' },
  DEBUG:    { cls: 'text-white/40 bg-white/5 border-white/10',            label: 'DEBUG' },
};

export default function SystemLogs() {
  const [logs, setLogs] = useState(mockLogs);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logAPI.getAll({ limit: 100 }).then(r => setLogs(r.data.data)).catch(() => {});
  }, []);

  const sources = ['all', ...new Set(mockLogs.map(l => l.source))];
  const levels = ['all', 'CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'];

  const filtered = logs.filter(l => {
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || l.level === levelFilter;
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchSearch && matchLevel && matchSource;
  });

  const summary = { CRITICAL: logs.filter(l => l.level === 'CRITICAL').length, ERROR: logs.filter(l => l.level === 'ERROR').length, WARN: logs.filter(l => l.level === 'WARN').length, INFO: logs.filter(l => l.level === 'INFO').length };

  return (
    <div className="space-y-6">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(summary).map(([level, count]) => {
          const cfg = levelConfig[level];
          return (
            <div key={level} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${cfg.cls}`}>
              <span>{cfg.label}</span>
              <span className="text-white/80">{count}</span>
            </div>
          );
        })}
        <span className="text-xs text-white/30 self-center ml-auto">{filtered.length} of {logs.length} entries</span>
      </div>

      {/* Filters */}
      <GlassCard className="p-4" animate={false}>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..." className="input-space pl-9 py-2 text-sm" />
          </div>

          {/* Level filter */}
          <div className="flex gap-1.5">
            {levels.map(l => (
              <button key={l} onClick={() => setLevelFilter(l)}
                className={`px-2.5 py-1.5 rounded text-xs font-semibold border transition-all capitalize ${levelFilter === l ? 'border-cyan bg-cyan/15 text-cyan' : 'border-white/10 text-white/40 hover:border-white/25'}`}>
                {l}
              </button>
            ))}
          </div>

          {/* Source filter */}
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
            className="input-space py-2 text-sm w-40 cursor-pointer">
            {sources.map(s => <option key={s} value={s} className="bg-space-800">{s === 'all' ? 'All Sources' : s}</option>)}
          </select>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:border-cyan/40 text-white/40 hover:text-cyan transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
      </GlassCard>

      {/* Log Table */}
      <GlassCard animate={false} className="overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
          <div className="pulse-dot pulse-dot-green"><span /></div>
          <h2 className="font-heading text-xs font-bold text-white tracking-wider">SYSTEM LOG STREAM</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-white/5 text-white/30">
                <th className="px-5 py-2.5 text-left">TIMESTAMP</th>
                <th className="px-4 py-2.5 text-left">LEVEL</th>
                <th className="px-4 py-2.5 text-left">SOURCE</th>
                <th className="px-4 py-2.5 text-left">COMPONENT</th>
                <th className="px-4 py-2.5 text-left">MESSAGE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const cfg = levelConfig[log.level] || levelConfig.INFO;
                return (
                  <tr key={log._id || i} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-2.5 text-white/30 whitespace-nowrap">
                      {log.timestamp ? format(new Date(log.timestamp), 'MM/dd HH:mm:ss') : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded border text-xs font-bold ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-2.5 text-cyan/70 whitespace-nowrap">{log.source}</td>
                    <td className="px-4 py-2.5 text-white/40 whitespace-nowrap">{log.component || '—'}</td>
                    <td className="px-4 py-2.5 text-white/65 max-w-md truncate">{log.message}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-white/30">No logs match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
