import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { analyticsAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import { TrendingUp, Fuel, Radio, CheckCircle, Cpu } from 'lucide-react';

const COLORS = ['#00d4ff', '#00ff88', '#7b2fff', '#ff6b35', '#ffd700'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-cyan px-4 py-3 text-xs">
      <p className="text-white/60 mb-2 font-mono">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const generateFuelData = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (6 - i));
  return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 'ARES-VII': +(Math.random() * 3 + 1).toFixed(2), 'HERMES-IV': +(Math.random() * 2 + 0.5).toFixed(2), 'EUROPA-II': +(Math.random() * 4 + 2).toFixed(2) };
});

const generateTransmissionData = () => Array.from({ length: 12 }, (_, i) => ({
  hour: `${String(i * 2).padStart(2, '0')}:00`,
  Downlink: +(Math.random() * 80 + 40).toFixed(1),
  Uplink: +(Math.random() * 30 + 10).toFixed(1),
}));

const generateSuccessData = () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
  month, Rate: +(Math.random() * 15 + 83).toFixed(1), Missions: Math.floor(Math.random() * 5) + 3
}));

const resourceData = [
  { resource: 'Compute', used: 72, capacity: 100 },
  { resource: 'Memory',  used: 68, capacity: 100 },
  { resource: 'Storage', used: 81, capacity: 100 },
  { resource: 'Network', used: 54, capacity: 100 },
  { resource: 'Power',   used: 76, capacity: 100 },
];

const kpiData = [
  { subject: 'Reliability', A: 96 }, { subject: 'Speed', A: 88 },
  { subject: 'Coverage', A: 92 }, { subject: 'Accuracy', A: 97 },
  { subject: 'Uptime', A: 99 }, { subject: 'Efficiency', A: 85 },
];

export default function Analytics() {
  const [fuelData] = useState(generateFuelData);
  const [txData] = useState(generateTransmissionData);
  const [successData] = useState(generateSuccessData);

  const kpis = [
    { label: 'Overall Success Rate', value: '96.4%',  color: 'text-mission-green', icon: CheckCircle },
    { label: 'Data Processed',        value: '1.4 PB',  color: 'text-cyan',          icon: Radio },
    { label: 'Avg Mission Duration',  value: '18.3mo', color: 'text-nebula',         icon: TrendingUp },
    { label: 'Fuel Efficiency',       value: '94.1%',  color: 'text-mission-gold',   icon: Fuel },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5 flex items-center gap-4">
            <k.icon size={22} className={k.color} />
            <div>
              <div className={`font-heading text-2xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-white/40">{k.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fuel Consumption */}
        <GlassCard className="p-5" animate={false}>
          <div className="flex items-center gap-2 mb-5">
            <Fuel size={16} className="text-mission-gold" />
            <h3 className="font-heading text-sm font-bold text-white">FUEL CONSUMPTION (kg/day)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fuelData}>
              <defs>
                {['#00d4ff','#00ff88','#ff6b35'].map((c, i) => (
                  <linearGradient key={i} id={`fg${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="ARES-VII"  stroke="#00d4ff" fill="url(#fg0)" strokeWidth={2} />
              <Area type="monotone" dataKey="HERMES-IV" stroke="#00ff88" fill="url(#fg1)" strokeWidth={2} />
              <Area type="monotone" dataKey="EUROPA-II" stroke="#ff6b35" fill="url(#fg2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Data Transmission */}
        <GlassCard className="p-5" animate={false}>
          <div className="flex items-center gap-2 mb-5">
            <Radio size={16} className="text-cyan" />
            <h3 className="font-heading text-sm font-bold text-white">DATA TRANSMISSION (Mbps)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={txData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Downlink" fill="#00d4ff" opacity={0.85} radius={[2,2,0,0]} />
              <Bar dataKey="Uplink"   fill="#7b2fff" opacity={0.85} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Mission Success Rate */}
        <GlassCard className="p-5" animate={false}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-mission-green" />
            <h3 className="font-heading text-sm font-bold text-white">MISSION SUCCESS RATE (%)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={successData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Rate" stroke="#00ff88" strokeWidth={2.5}
                dot={{ fill: '#00ff88', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#00ff88', stroke: 'rgba(0,255,136,0.3)', strokeWidth: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Resource Utilization */}
        <GlassCard className="p-5" animate={false}>
          <div className="flex items-center gap-2 mb-5">
            <Cpu size={16} className="text-nebula" />
            <h3 className="font-heading text-sm font-bold text-white">RESOURCE UTILIZATION (%)</h3>
          </div>
          <div className="space-y-4 mt-4">
            {resourceData.map((r, i) => (
              <div key={r.resource} className="flex items-center gap-4">
                <span className="text-xs text-white/60 w-16 shrink-0">{r.resource}</span>
                <div className="flex-1 progress-bar">
                  <motion.div className={`h-full rounded-full ${r.used > 80 ? 'progress-fill-rocket' : r.used > 60 ? 'progress-fill-gold' : 'progress-fill-cyan'}`}
                    initial={{ width: 0 }} animate={{ width: `${r.used}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                </div>
                <span className={`text-xs font-mono w-10 text-right font-bold ${r.used > 80 ? 'text-rocket' : r.used > 60 ? 'text-mission-gold' : 'text-cyan'}`}>
                  {r.used}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-xs text-white/40 mb-3 font-mono">PERFORMANCE RADAR</h4>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={kpiData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} />
                <Radar name="Score" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
