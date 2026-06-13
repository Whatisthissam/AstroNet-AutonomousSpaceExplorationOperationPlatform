import { motion } from 'framer-motion';

export default function TelemetryGauge({ label, value, max = 100, unit = '%', color = 'cyan', icon: Icon, size = 'md' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = size === 'lg' ? 52 : 40;
  const strokeWidth = size === 'lg' ? 5 : 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    cyan:   { stroke: '#00d4ff', text: 'text-cyan',         glow: '0 0 15px rgba(0,212,255,0.5)' },
    green:  { stroke: '#00ff88', text: 'text-mission-green', glow: '0 0 15px rgba(0,255,136,0.5)' },
    rocket: { stroke: '#ff6b35', text: 'text-rocket',        glow: '0 0 15px rgba(255,107,53,0.5)' },
    gold:   { stroke: '#ffd700', text: 'text-mission-gold',  glow: '0 0 15px rgba(255,215,0,0.5)' },
    nebula: { stroke: '#7b2fff', text: 'text-nebula',        glow: '0 0 15px rgba(123,47,255,0.5)' },
  };

  const c = colorMap[color] || colorMap.cyan;
  const svgSize = radius * 2 + strokeWidth * 2 + 4;
  const center = svgSize / 2;

  // Color based on value thresholds
  let actualColor = color;
  if (label?.toLowerCase().includes('fuel') || label?.toLowerCase().includes('battery')) {
    actualColor = value > 60 ? 'green' : value > 30 ? 'gold' : 'rocket';
  }
  const ac = colorMap[actualColor] || colorMap.cyan;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={svgSize} height={svgSize} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle cx={center} cy={center} r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          {/* Progress arc */}
          <motion.circle
            cx={center} cy={center} r={radius} fill="none"
            stroke={ac.stroke} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(${ac.glow})` }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && <Icon size={size === 'lg' ? 14 : 12} className={`${ac.text} mb-0.5`} />}
          <span className={`font-heading text-sm font-bold ${ac.text}`}>
            {typeof value === 'number' ? value.toFixed(0) : value}
          </span>
          <span className="text-xs text-white/40">{unit}</span>
        </div>
      </div>
      <p className="text-xs text-white/60 text-center leading-tight">{label}</p>
    </div>
  );
}
