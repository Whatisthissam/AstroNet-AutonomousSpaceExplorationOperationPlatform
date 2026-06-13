import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Server, GitBranch, Cloud, Box, BarChart3, LayoutDashboard, Database, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { devopsAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';

const mockStatus = {
  docker:     { status: 'operational', containers: { running: 28, stopped: 4, total: 32 }, version: '24.0.7', cpuUsage: 38.2, memoryUsage: 64.5 },
  jenkins:    { status: 'operational', pipelines: { running: 2, queued: 3, failed: 1 }, lastBuild: { number: 1287, result: 'SUCCESS', duration: '4m 32s' }, version: '2.426.3' },
  kubernetes: { status: 'operational', nodes: { ready: 5, notReady: 0, total: 5 }, pods: { running: 94, pending: 3, failed: 1, total: 108 }, namespaces: 12, version: 'v1.29.0' },
  terraform:  { status: 'operational', lastApply: new Date(Date.now() - 86400000 * 2).toISOString(), resources: { managed: 847, tainted: 2, destroyed: 0 }, workspaces: ['production', 'staging', 'development'], version: '1.6.6' },
  prometheus: { status: 'degraded', targets: { up: 47, down: 2 }, alertsFiring: 3, dataRetention: '15d', scrapeInterval: '15s', version: '2.48.0' },
  grafana:    { status: 'operational', dashboards: 34, alerts: { firing: 2, silenced: 1 }, users: 28, version: '10.2.3' },
  elk:        { status: 'operational', elasticsearch: { nodes: 3, indicesCount: 47, storageUsed: '712 GB' }, logstash: { pipelinesActive: 8, eventsPerSecond: 5847 }, kibana: { status: 'operational' }, version: '8.11.3' },
  vault:      { status: 'operational', secrets: { engines: 12, leases: 924 }, policies: 24, tokens: { total: 142 }, sealed: false, version: '1.15.4' },
};

const deployments = [
  { service: 'mission-api',          env: 'production', version: 'v2.4.1',      status: 'success', time: '2h ago',  by: 'CI/CD Pipeline' },
  { service: 'telemetry-processor',  env: 'production', version: 'v1.9.0',      status: 'success', time: '8h ago',  by: 'Cmdr. Rodriguez' },
  { service: 'dashboard-frontend',   env: 'staging',    version: 'v3.1.0-beta', status: 'running', time: '1h ago',  by: 'CI/CD Pipeline' },
  { service: 'incident-manager',     env: 'production', version: 'v1.2.3',      status: 'failed',  time: '30m ago', by: 'Dr. Chen' },
  { service: 'auth-service',         env: 'production', version: 'v4.0.2',      status: 'success', time: '1d ago',  by: 'CI/CD Pipeline' },
];

const StatusIcon = ({ status }) => {
  if (status === 'operational') return <CheckCircle size={14} className="text-mission-green" />;
  if (status === 'degraded')    return <AlertTriangle size={14} className="text-mission-gold" />;
  return <XCircle size={14} className="text-rocket" />;
};

const statusGlow = { operational: 'border-mission-green/20', degraded: 'border-mission-gold/20', down: 'border-rocket/30' };
const statusText = { operational: 'text-mission-green', degraded: 'text-mission-gold', down: 'text-rocket' };

export default function DevOps() {
  const [data, setData] = useState(mockStatus);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await devopsAPI.getStatus();
      setData(res.data.data);
    } catch { /* use mock */ }
    setLastRefresh(new Date());
    setTimeout(() => setLoading(false), 400);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [refresh]);

  const services = [
    { key: 'docker',     label: 'Docker',      icon: Box,           desc: 'Container Runtime' },
    { key: 'jenkins',    label: 'Jenkins',      icon: GitBranch,     desc: 'CI/CD Pipelines' },
    { key: 'kubernetes', label: 'Kubernetes',   icon: Cloud,         desc: 'Container Orchestration' },
    { key: 'terraform',  label: 'Terraform',    icon: Server,        desc: 'Infrastructure as Code' },
    { key: 'prometheus', label: 'Prometheus',   icon: BarChart3,     desc: 'Metrics & Alerting' },
    { key: 'grafana',    label: 'Grafana',      icon: LayoutDashboard, desc: 'Visualization & Dashboards' },
    { key: 'elk',        label: 'ELK Stack',    icon: Database,      desc: 'Log Management' },
    { key: 'vault',      label: 'Vault',        icon: Shield,        desc: 'Secret Management' },
  ];

  const renderDetails = (key, d) => {
    if (!d) return null;
    switch (key) {
      case 'docker': return (
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
          <div className="text-center"><div className="font-bold text-mission-green">{d.containers?.running}</div><div className="text-white/30">Running</div></div>
          <div className="text-center"><div className="font-bold text-rocket">{d.containers?.stopped}</div><div className="text-white/30">Stopped</div></div>
          <div className="text-center"><div className="font-bold text-cyan">{d.cpuUsage}%</div><div className="text-white/30">CPU</div></div>
        </div>
      );
      case 'jenkins': return (
        <div className="mt-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-white/40">Last Build</span><span className={d.lastBuild?.result === 'SUCCESS' ? 'text-mission-green' : 'text-rocket'}>#{d.lastBuild?.number} {d.lastBuild?.result}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Running</span><span className="text-cyan">{d.pipelines?.running}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Failed</span><span className="text-rocket">{d.pipelines?.failed}</span></div>
        </div>
      );
      case 'kubernetes': return (
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div><div className="text-white/30">Nodes Ready</div><div className="font-bold text-mission-green">{d.nodes?.ready}/{d.nodes?.total}</div></div>
          <div><div className="text-white/30">Pods Running</div><div className="font-bold text-cyan">{d.pods?.running}/{d.pods?.total}</div></div>
          <div><div className="text-white/30">Namespaces</div><div className="font-bold text-nebula">{d.namespaces}</div></div>
          <div><div className="text-white/30">Failed Pods</div><div className={`font-bold ${d.pods?.failed > 0 ? 'text-rocket' : 'text-white/40'}`}>{d.pods?.failed}</div></div>
        </div>
      );
      case 'terraform': return (
        <div className="mt-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-white/40">Managed</span><span className="text-cyan">{d.resources?.managed}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Tainted</span><span className={d.resources?.tainted > 0 ? 'text-mission-gold' : 'text-white/30'}>{d.resources?.tainted}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Workspaces</span><span className="text-nebula">{d.workspaces?.length}</span></div>
        </div>
      );
      case 'prometheus': return (
        <div className="mt-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-white/40">Targets Up</span><span className="text-mission-green">{d.targets?.up}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Targets Down</span><span className={d.targets?.down > 0 ? 'text-rocket' : 'text-white/30'}>{d.targets?.down}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Alerts Firing</span><span className={d.alertsFiring > 0 ? 'text-rocket' : 'text-white/30'}>{d.alertsFiring}</span></div>
        </div>
      );
      case 'grafana': return (
        <div className="mt-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-white/40">Dashboards</span><span className="text-cyan">{d.dashboards}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Alerts Firing</span><span className={d.alerts?.firing > 0 ? 'text-mission-gold' : 'text-white/30'}>{d.alerts?.firing}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Active Users</span><span className="text-nebula">{d.users}</span></div>
        </div>
      );
      case 'elk': return (
        <div className="mt-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-white/40">ES Nodes</span><span className="text-cyan">{d.elasticsearch?.nodes}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Indices</span><span className="text-nebula">{d.elasticsearch?.indicesCount}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Events/sec</span><span className="text-mission-green">{d.logstash?.eventsPerSecond?.toLocaleString()}</span></div>
        </div>
      );
      case 'vault': return (
        <div className="mt-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-white/40">Sealed</span><span className={d.sealed ? 'text-rocket' : 'text-mission-green'}>{d.sealed ? 'YES' : 'NO'}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Secret Engines</span><span className="text-cyan">{d.secrets?.engines}</span></div>
          <div className="flex justify-between"><span className="text-white/40">Active Tokens</span><span className="text-nebula">{d.tokens?.total}</span></div>
        </div>
      );
      default: return null;
    }
  };

  const operational = services.filter(s => data[s.key]?.status === 'operational').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`font-heading text-4xl font-bold ${operational >= 7 ? 'text-mission-green' : 'text-mission-gold'}`}>{operational}/{services.length}</div>
          <div>
            <div className="text-white font-semibold">Services Operational</div>
            <div className="text-xs text-white/40">Last refresh: {lastRefresh.toLocaleTimeString()}</div>
          </div>
        </div>
        <button onClick={refresh} className="btn-secondary flex items-center gap-2 py-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map(({ key, label, icon: Icon, desc }) => {
          const d = data[key];
          const status = d?.status || 'unknown';
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-5 border hover:-translate-y-1 transition-all duration-300 ${statusGlow[status] || 'border-white/10'}`}
              style={{ boxShadow: status === 'operational' ? '0 4px 24px rgba(0,255,136,0.06)' : status === 'degraded' ? '0 4px 24px rgba(255,215,0,0.06)' : undefined }}>
              <div className="flex items-start justify-between mb-2">
                <Icon size={20} className={statusText[status] || 'text-white/40'} />
                <div className="flex items-center gap-1.5">
                  <StatusIcon status={status} />
                  <span className={`text-xs font-bold font-heading ${statusText[status]}`}>{status.toUpperCase()}</span>
                </div>
              </div>
              <h3 className="font-heading text-sm font-bold text-white mt-2">{label}</h3>
              <p className="text-xs text-white/40">{desc}</p>
              {d?.version && <p className="text-xs text-white/25 mt-1 font-mono">{d.version}</p>}
              {renderDetails(key, d)}
            </motion.div>
          );
        })}
      </div>

      {/* Deployments */}
      <GlassCard className="p-5" animate={false}>
        <h3 className="font-heading text-sm font-bold text-white mb-4">RECENT DEPLOYMENTS</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 border-b border-white/5">
                <th className="text-left py-2 pr-4 font-mono">SERVICE</th>
                <th className="text-left py-2 pr-4 font-mono">ENV</th>
                <th className="text-left py-2 pr-4 font-mono">VERSION</th>
                <th className="text-left py-2 pr-4 font-mono">STATUS</th>
                <th className="text-left py-2 pr-4 font-mono">TIME</th>
                <th className="text-left py-2 font-mono">DEPLOYED BY</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 pr-4 font-mono text-cyan/80 text-xs">{d.service}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${d.env === 'production' ? 'bg-rocket/15 text-rocket' : 'bg-nebula/15 text-nebula'}`}>{d.env}</span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-white/60">{d.version}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3 pr-4 text-xs text-white/40">{d.time}</td>
                  <td className="py-3 text-xs text-white/50">{d.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
