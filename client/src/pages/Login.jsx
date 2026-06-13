import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Eye, EyeOff, Shield, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import StarfieldBackground from '../components/layout/StarfieldBackground';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@astronet.io', password: 'Admin@123' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    if (res.success) navigate('/dashboard');
    setLoading(false);
  };

  const credentials = [
    { label: 'Admin',      email: 'admin@astronet.io',      pwd: 'Admin@123',   role: 'admin' },
    { label: 'Controller', email: 'controller@astronet.io', pwd: 'Control@123', role: 'controller' },
    { label: 'Analyst',    email: 'analyst@astronet.io',    pwd: 'Analyst@123', role: 'analyst' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <StarfieldBackground starCount={200} />

      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #7b2fff, transparent)', filter: 'blur(80px)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7b2fff)', boxShadow: '0 0 30px rgba(0,212,255,0.5)' }}>
            <Rocket size={28} className="text-space-900" />
          </div>
          <h1 className="font-heading text-2xl font-black text-white">ASTRONET</h1>
          <p className="text-cyan/60 text-xs tracking-widest mt-1">MISSION CONTROL ACCESS</p>
        </motion.div>

        {/* Back to Landing Page Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-4 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white/80 transition-colors border border-white/5 bg-white/2 hover:border-white/20 px-3.5 py-2 rounded-lg backdrop-blur-md">
            <ArrowLeft size={13} /> RETURN TO COMMAND PORTAL
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card-cyan p-8">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="pulse-dot pulse-dot-green"><span /></div>
              <span className="text-xs text-mission-green/70 font-mono">SECURE CHANNEL ACTIVE</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-nebula/70">
              <Shield size={12} />
              <span>JWT Auth</span>
            </div>
          </div>

          <h2 className="font-heading text-lg font-bold text-white mb-6">AUTHENTICATION REQUIRED</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-mono tracking-wider">OPERATOR ID (EMAIL)</label>
              <input id="email" type="email" value={form.email} required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-space"
                placeholder="operator@astronet.io"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-mono tracking-wider">ACCESS CODE</label>
              <div className="relative">
                <input id="password" type={showPwd ? 'text' : 'password'} value={form.password} required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-space pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="login-btn" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-space-900/30 border-t-space-900 rounded-full animate-spin" /> AUTHENTICATING...</>
              ) : (
                <><Zap size={16} /> INITIATE ACCESS</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Quick-login credentials */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-4 glass-card p-4">
          <p className="text-xs text-white/40 text-center mb-3 font-mono">DEMO CREDENTIALS (click to fill)</p>
          <div className="grid grid-cols-3 gap-2">
            {credentials.map((c) => (
              <button key={c.label} onClick={() => setForm({ email: c.email, password: c.pwd })}
                className="text-center p-2 rounded-lg border border-white/10 hover:border-cyan/40 hover:bg-cyan/5 transition-all duration-200">
                <div className="text-xs font-bold text-cyan mb-0.5">{c.label}</div>
                <div className="text-xs text-white/30 capitalize">{c.role}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
