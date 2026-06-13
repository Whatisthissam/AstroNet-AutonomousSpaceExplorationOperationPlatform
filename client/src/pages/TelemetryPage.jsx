import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Mountain, Zap, Droplets, Wifi, Battery, RefreshCw, Gauge, Radio, Sun } from 'lucide-react';
import { telemetryAPI } from '../services/api';
import TelemetryGauge from '../components/ui/TelemetryGauge';
import GlassCard from '../components/ui/GlassCard';

const missions = [
  { id: 'MSN-2024-001', name: 'ARES-VII', status: 'active' },
  { id: 'MSN-2024-002', name: 'HERMES-IV', status: 'active' },
  { id: 'MSN-2024-003', name: 'EUROPA-II', status: 'critical' },
];

const randomize = (base, variance, min, max) => {
  const v = base + (Math.random() - 0.5) * variance;
  return parseFloat(Math.min(max, Math.max(min, v)).toFixed(2));
};

const genTelemetry = (missionId) => {
  const bases = {
    'MSN-2024-001': { temp: -85, alt: 258, vel: 7660, fuel: 72, sig: 93, bat: 91, pres: 1.1, rad: 0.25, solar: 96, dtr: 130 },
    'MSN-2024-002': { temp: -70, alt: 408, vel: 7700, fuel: 61, sig: 94, bat: 88, pres: 1.0, rad: 0.2,  solar: 94, dtr: 125 },
    'MSN-2024-003': { temp: -120, alt: 550, vel: 7500, fuel: 48, sig: 67, bat: 79, pres: 0.9, rad: 0.35, solar: 82, dtr: 80 },
  };
  const b = bases[missionId] || bases['MSN-2024-001'];
  return {
    temperature: randomize(b.temp, 8, -180, 150),
    altitude: randomize(b.alt, 3, 100, 900),
    velocity: randomize(b.vel, 50, 6000, 9000),
    fuelLevel: randomize(b.fuel, 0.5, 0, 100),
    signalStrength: randomize(b.sig, 4, 10, 100),
    batteryLevel: randomize(b.bat, 2, 10, 100),
    pressure: randomize(b.pres, 0.05, 0, 5),
    radiation: randomize(b.rad, 0.03, 0, 5),
    solarPanelOutput: randomize(b.solar, 2, 10, 100),
    dataTransmissionRate: randomize(b.dtr, 10, 0, 300),
    thrusterStatus: Math.random() > 0.95 ? 'degraded' : 'nominal',
    gyroscopeStatus: 'nominal',
    timestamp: new Date(),
  };
};

export default function TelemetryPage() {
  const [selectedMission, setSelectedMission] = useState(missions[0]);
  const [telemetry, setTelemetry] = useState(genTelemetry(missions[0].id));
  const [history, setHistory] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refresh = useCallback(() => {
    setRefreshing(true);
    const data = genTelemetry(selectedMission.id);
    setTelemetry(data);
    setHistory(h => [data, ...h].slice(0, 20));
    setLastUpdate(new Date());
    setTimeout(() => setRefreshing(false), 300);
  }, [selectedMission]);

  useEffect(() => { refresh(); }, [selectedMission, refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [autoRefresh, refresh]);

  const gauges = [
    { label: 'Fuel Level',    value: telemetry.fuelLevel,          max: 100, unit: '%',    color: 'green',  icon: Droplets },
    { label: 'Signal Str.',   value: telemetry.signalStrength,      max: 100, unit: '%',    color: 'cyan',   icon: Wifi },
    { label: 'Battery',       value: telemetry.batteryLevel,        max: 100, unit: '%',    color: 'green',  icon: Battery },
    { label: 'Solar Output',  value: telemetry.solarPanelOutput,    max: 100, unit: '%',    color: 'gold',   icon: Sun },
  ];

  const metrics = [
    { label: 'Temperature',      value: `${telemetry.temperature.toFixed(1)}°C`, icon: Thermometer, color: telemetry.temperature > 0 ? 'text-rocket' : 'text-cyan' },
    { label: 'Altitude',         value: `${telemetry.altitude.toFixed(1)} km`,  icon: Mountain,    color: 'text-nebula' },
    { label: 'Velocity',         value: `${(telemetry.velocity / 1000).toFixed(2)} km/s`, icon: Zap, color: 'text-cyan' },
    { label: 'Pressure',         value: `${telemetry.pressure.toFixed(2)} atm`, icon: Gauge,       color: 'text-mission-gold' },
    { label: 'Radiation',        value: `${telemetry.radiation.toFixed(2)} mSv/hr`, icon: Radio,   color: 'text-rocket' },
    { label: 'Data Rate',        value: `${telemetry.dataTransmissionRate.toFixed(0)} Mbps`, icon: Wifi, color: 'text-mission-green' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Mission selector */}
        <div className="flex gap-2">
          {missions.map((m) => (
            <button key={m.id} onClick={() => setSelectedMission(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${selectedMission.id === m.id
                ? 'border-cyan bg-cyan/15 text-cyan'
                : 'border-white/10 text-white/50 hover:border-white/30'}`}>
              {m.name}
              <span className={`ml-2 w-1.5 h-1.5 rounded-full inline-block ${m.status === 'critical' ? 'bg-rocket' : 'bg-mission-green'}`} />
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-white/30 font-mono">Updated {lastUpdate.toLocaleTimeString()}</span>
          <button onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs border font-semibold transition-all duration-200 ${autoRefresh ? 'border-mission-green/40 bg-mission-green/10 text-mission-green' : 'border-white/15 text-white/40'}`}>
            {autoRefresh ? '● LIVE' : '○ PAUSED'}
          </button>
          <button onClick={refresh}
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-cyan/40 hover:bg-cyan/5 transition-all">
            <RefreshCw size={14} className={`text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Gauges Row */}
      <GlassCard className="p-6" animate={false}>
        <div className="flex items-center gap-2 mb-6">
          <div className="pulse-dot pulse-dot-green"><span /></div>
          <h2 className="font-heading text-sm font-bold text-white">{selectedMission.name} — LIVE TELEMETRY</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {gauges.map((g) => (
            <AnimatePresence key={g.label} mode="wait">
              <motion.div key={`${g.label}-${refreshing}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                <TelemetryGauge {...g} size="lg" />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </GlassCard>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <GlassCard key={m.label} className="p-4 text-center" animate={false}>
            <m.icon size={18} className={`${m.color} mx-auto mb-2`} />
            <AnimatePresence mode="wait">
              <motion.div key={m.value} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`font-heading text-base font-bold ${m.color} mb-1`}>
                {m.value}
              </motion.div>
            </AnimatePresence>
            <p className="text-xs text-white/40">{m.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-5" animate={false}>
          <h3 className="font-heading text-sm font-bold text-white mb-4">SUBSYSTEM STATUS</h3>
          <div className="space-y-3">
            {[
              { name: 'Propulsion System',  status: 'nominal' },
              { name: 'Navigation Array',   status: 'nominal' },
              { name: 'Communication Suite', status: selectedMission.status === 'critical' ? 'degraded' : 'nominal' },
              { name: 'Power Management',   status: 'nominal' },
              { name: 'Thermal Control',    status: 'nominal' },
              { name: 'Science Payload',    status: selectedMission.status === 'critical' ? 'degraded' : 'nominal' },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-sm text-white/70">{s.name}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'nominal' ? 'bg-mission-green animate-pulse' : 'bg-mission-gold'}`} />
                  <span className={`text-xs font-mono font-semibold ${s.status === 'nominal' ? 'text-mission-green' : 'text-mission-gold'}`}>
                    {s.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5" animate={false}>
          <h3 className="font-heading text-sm font-bold text-white mb-4">RECENT READINGS LOG</h3>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {(history.length > 0 ? history : [telemetry]).map((h, i) => (
              <div key={i} className="font-mono text-xs p-2 rounded bg-white/[0.02] flex items-center gap-3">
                <span className="text-white/30">{new Date(h.timestamp || Date.now()).toLocaleTimeString()}</span>
                <span className="text-mission-green/70">ALT</span>
                <span className="text-white/60">{h.altitude?.toFixed(1)} km</span>
                <span className="text-cyan/70">VEL</span>
                <span className="text-white/60">{(h.velocity / 1000)?.toFixed(2)} km/s</span>
                <span className="text-mission-gold/70">FUEL</span>
                <span className="text-white/60">{h.fuelLevel?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
