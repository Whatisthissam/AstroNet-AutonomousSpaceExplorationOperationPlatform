import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Satellite, Shield, Zap, Globe, BarChart3, ChevronRight, Play } from 'lucide-react';
import HeroScene from '../components/three/HeroScene';
import StarfieldBackground from '../components/layout/StarfieldBackground';
import StatCounter from '../components/ui/StatCounter';

const features = [
  { icon: Rocket, title: 'Mission Management', desc: 'Plan, launch, and monitor missions with real-time status updates and health tracking.', color: 'cyan' },
  { icon: Satellite, title: 'Live Telemetry', desc: 'Sub-second telemetry feeds from spacecraft — temperature, altitude, velocity, fuel.', color: 'green' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Interactive charts for fuel consumption, data transmission, and mission success rates.', color: 'nebula' },
  { icon: Shield, title: 'Incident Response', desc: 'Real-time incident tracking with timeline management and automated recovery actions.', color: 'rocket' },
  { icon: Zap, title: 'DevOps Integration', desc: 'Live dashboards for Docker, Kubernetes, Jenkins, Prometheus, Grafana, and more.', color: 'gold' },
  { icon: Globe, title: 'Global Coverage', desc: 'Deep space tracking network with 47 ground stations across all continents.', color: 'cyan' },
];

const missions = [
  { name: 'ARES-VII', destination: 'Mars Orbit', status: 'active',    progress: 68, color: '#3B82F6' },
  { name: 'HERMES-IV', destination: 'Lunar Gateway', status: 'active',   progress: 45, color: '#00ff88' },
  { name: 'EUROPA-II', destination: 'Jupiter System', status: 'critical', progress: 82, color: '#ff6b35' },
  { name: 'SOLAR WATCH-I', destination: 'L1 Point',      status: 'standby', progress: 0,  color: '#ffd700' },
];

const colorMap = {
  cyan: { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5', glow: 'rgba(59,130,246,0.1)' },
  green: { text: 'text-mission-green', border: 'border-mission-green/20', bg: 'bg-mission-green/5', glow: 'rgba(0,255,136,0.1)' },
  nebula: { text: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/5', glow: 'rgba(139,92,246,0.1)' },
  rocket: { text: 'text-rocket', border: 'border-rocket/20', bg: 'bg-rocket/5', glow: 'rgba(255,107,53,0.1)' },
  gold: { text: 'text-mission-gold', border: 'border-mission-gold/20', bg: 'bg-mission-gold/5', glow: 'rgba(255,215,0,0.1)' },
};

function BentoCard({ f, i }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const c = colorMap[f.color] || colorMap.cyan;
  const spanClass = 
    i === 0 ? 'lg:col-span-2 md:col-span-2' :
    i === 3 ? 'lg:col-span-2 md:col-span-2' :
    i === 5 ? 'lg:col-span-2 md:col-span-2' :
    'lg:col-span-1 md:col-span-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className={`glass-card p-8 border ${c.border} relative overflow-hidden group transition-all duration-500 ${spanClass}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Light spotlight effect following the cursor */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.07), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${c.bg} ${c.border} border transition-all duration-300 group-hover:scale-110`}>
            <f.icon size={22} className={c.text} />
          </div>
          <h3 className={`font-heading text-lg font-bold mb-3 ${c.text}`}>{f.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">{f.desc}</p>
        </div>

        {/* Dynamic Mock elements inside bento panels for high fidelity */}
        {i === 0 && (
          <div className="mt-8 border border-white/5 bg-slate-900/60 rounded-lg p-4 font-mono text-[11px] hidden sm:block">
            <div className="flex justify-between items-center mb-2 text-white/40 pb-2 border-b border-white/5">
              <span>SYSTEMS TELEMETRY STREAM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-mission-green animate-pulse" />
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between"><span className="text-blue-400">ARES-VII</span><span>NOMINAL [68% PROGRESS]</span></div>
              <div className="flex justify-between"><span className="text-violet-400">HERMES-IV</span><span>IN TRANSIT [45% PROGRESS]</span></div>
            </div>
          </div>
        )}

        {i === 3 && (
          <div className="mt-8 border border-white/5 bg-slate-900/60 rounded-lg p-4 font-mono text-[11px] hidden sm:block">
            <div className="flex justify-between items-center mb-2 text-white/40 pb-2 border-b border-white/5">
              <span>INCIDENT CENTER LOGS</span>
              <span className="text-rocket animate-pulse font-bold">1 CRITICAL ALERT</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-rocket">EUROPA-II</span><span>ANTENNA POINTING ERROR [16:30]</span></div>
              <div className="flex justify-between"><span className="text-slate-500">SOLAR WATCH</span><span>STANDBY RESOLUTION TRIGGERED [15:12]</span></div>
            </div>
          </div>
        )}

        {i === 5 && (
          <div className="mt-8 border border-white/5 bg-slate-900/60 rounded-lg p-4 font-mono text-[11px] hidden sm:block">
            <div className="flex justify-between items-center mb-2 text-white/40 pb-2 border-b border-white/5">
              <span>TRACKING STATS NETWORK</span>
              <span className="text-blue-400 font-bold">47 ACTIVE STATIONS</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-slate-300">
              <div className="bg-white/5 p-2 rounded"><div className="text-blue-400 font-bold">DSS-14</div><div className="text-[9px] text-white/40">CALIFORNIA</div></div>
              <div className="bg-white/5 p-2 rounded"><div className="text-blue-400 font-bold">DSS-43</div><div className="text-[9px] text-white/40">CANBERRA</div></div>
              <div className="bg-white/5 p-2 rounded"><div className="text-blue-400 font-bold">DSS-63</div><div className="text-[9px] text-white/40">MADRID</div></div>
            </div>
          </div>
        )}

        {(i !== 0 && i !== 3 && i !== 5) && (
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>PLATFORM SYNC</span>
            <span className="text-blue-400">SECURE CONNECTED</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-space-900">
      <StarfieldBackground starCount={200} />

      {/* Volumetric background lights for Stripe/Linear feel */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />


      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="z-10 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/25 bg-blue-500/5 mb-8 shadow-sm">
                <div className="pulse-dot pulse-dot-green"><span /></div>
                <span className="text-xs text-blue-400 font-mono font-semibold tracking-wider">SYSTEMS OPERATIONAL — 47 MISSIONS ACTIVE</span>
              </div>

              <h1 className="font-hero text-5xl md:text-7xl lg:text-[84px] font-bold text-white leading-[0.95] tracking-tight mb-8">
                AUTONOMOUS
                <span className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #60A5FA, #8B5CF6)' }}>
                  SPACE OPS
                </span>
                PLATFORM
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl font-body">
                Enterprise-grade mission control platform for managing deep space exploration.
                Real-time telemetry, AI-assisted operations, and integrated DevOps — all in one unified interface.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/login" className="btn-primary flex items-center gap-2 px-8 py-4">
                  <Rocket size={18} /> Launch Control Center
                </Link>
                <button className="btn-secondary flex items-center gap-2 px-6 py-4">
                  <Play size={16} /> Watch Demo
                </button>
              </div>

              {/* Mini stats */}
              <div className="flex gap-10 pt-8 border-t border-white/5">
                {[
                  { val: '247', label: 'Missions Flown' },
                  { val: '98.4%', label: 'Success Rate' },
                  { val: '47', label: 'Active Satellites' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-3xl font-bold text-blue-400 text-glow-cyan">{s.val}</div>
                    <div className="text-[11px] text-slate-400/70 font-heading tracking-wide mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3D Earth */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="h-[500px] lg:h-[650px] relative z-10">
            <HeroScene />
            {/* Premium vision-pro glass float labels */}
            <div className="absolute top-8 right-4 glass-card-cyan px-4 py-3 text-xs font-mono animate-float" style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.2)' }}>
              <div className="text-blue-400 font-bold tracking-wider">ARES-VII</div>
              <div className="text-white/70 mt-0.5">ALT: <span className="font-semibold text-white">258 km</span></div>
            </div>
            <div className="absolute bottom-20 left-4 glass-card px-4 py-3 text-xs font-mono border-emerald-500/20" style={{ animationDelay: '2s', boxShadow: '0 8px 32px rgba(16,185,129,0.1)' }}>
              <div className="text-mission-green font-bold tracking-wider">HERMES-IV</div>
              <div className="text-white/70 mt-0.5">STATUS: <span className="font-semibold text-white">NOMINAL ✓</span></div>
            </div>
            <div className="absolute top-1/2 right-2 glass-card px-4 py-3 text-xs font-mono border-rocket/20" style={{ animationDelay: '4s', boxShadow: '0 8px 32px rgba(239,68,68,0.1)' }}>
              <div className="text-rocket font-bold tracking-wider">EUROPA-II</div>
              <div className="text-white/70 mt-0.5">LINK: <span className="font-semibold text-white">DEGRADED</span></div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-blue-500/40" />
          <div className="w-1 h-1 rounded-full bg-blue-500" />
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-8">
          <div className="glass-card p-12">
            <div className="divider-glow mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter value={247}  suffix="+" label="Total Missions"    color="cyan" />
              <StatCounter value={98.4} suffix="%" label="Mission Success"   color="green" decimals={1} />
              <StatCounter value={47}         label="Active Satellites"  color="nebula" />
              <StatCounter value={4.2}  suffix="B km" label="Distance Tracked" color="gold" decimals={1} />
            </div>
            <div className="divider-glow mt-12" />
          </div>
        </div>
      </section>

      {/* ===================== ACTIVE MISSIONS ===================== */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="section-label mb-2">Current Operations</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Active Missions</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missions.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-t-2 group hover:-translate-y-1 transition-transform duration-300"
                style={{ borderTopColor: m.color }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-base font-bold text-white">{m.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider font-mono border"
                    style={{ color: m.color, background: `${m.color}15`, borderColor: `${m.color}25` }}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 font-mono">{m.destination}</p>
                {m.progress > 0 && (
                  <>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/40">Mission Progress</span>
                      <span style={{ color: m.color }} className="font-mono font-semibold">{m.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${m.progress}%`, background: `linear-gradient(to right, ${m.color}55, ${m.color})` }} />
                    </div>
                  </>
                )}
                {m.progress === 0 && <p className="text-xs text-mission-gold/60 font-mono mt-2">📋 Pre-launch preparations</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="section-label mb-2">Platform Capabilities</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Mission Critical Features</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto font-body">Everything you need to plan, execute, and analyze space exploration missions with confidence.</p>
          </motion.div>
          
          {/* Bento Grid layout with larger gap and hover interactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <BentoCard key={f.title} f={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card-cyan p-16 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="font-heading text-5xl mb-4">🚀</div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Ready for Launch?</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto font-body">
                Join the next generation of space exploration operations. Your mission control center awaits.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
                <Rocket size={20} /> Enter Mission Control <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 text-center">
        <p className="text-white/30 text-sm font-mono">
          © 2026 AstroNet Mission Control. Built for the stars. 
          <span className="text-blue-400/50 ml-2">v3.1.0</span>
        </p>
      </footer>
    </div>
  );
}
