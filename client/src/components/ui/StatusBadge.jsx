import { motion } from 'framer-motion';

const statusConfig = {
  active:      { label: 'ACTIVE',      cls: 'badge-active' },
  critical:    { label: 'CRITICAL',    cls: 'badge-critical' },
  standby:     { label: 'STANDBY',     cls: 'badge-standby' },
  completed:   { label: 'COMPLETED',   cls: 'badge-completed' },
  planning:    { label: 'PLANNING',    cls: 'badge-planning' },
  failed:      { label: 'FAILED',      cls: 'badge-failed' },
  nominal:     { label: 'NOMINAL',     cls: 'badge-active' },
  degraded:    { label: 'DEGRADED',    cls: 'badge-standby' },
  lost:        { label: 'LOST',        cls: 'badge-critical' },
  operational: { label: 'OPERATIONAL', cls: 'badge-active' },
  down:        { label: 'DOWN',        cls: 'badge-critical' },
  investigating:{ label: 'INVESTIGATING', cls: 'badge-standby' },
  resolved:    { label: 'RESOLVED',    cls: 'badge-completed' },
  closed:      { label: 'CLOSED',      cls: 'badge-planning' },
  low:         { label: 'LOW',         cls: 'badge-completed' },
  medium:      { label: 'MEDIUM',      cls: 'badge-planning' },
  high:        { label: 'HIGH',        cls: 'badge-standby' },
  success:     { label: 'SUCCESS',     cls: 'badge-active' },
  running:     { label: 'RUNNING',     cls: 'badge-standby' },
};

export default function StatusBadge({ status, className = '' }) {
  const cfg = statusConfig[status?.toLowerCase()] || { label: status?.toUpperCase() || 'UNKNOWN', cls: 'badge-planning' };
  return (
    <span className={`${cfg.cls} font-heading tracking-widest ${className}`}>
      {cfg.label}
    </span>
  );
}
