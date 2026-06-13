/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#000000',
          800: '#07070a',
          700: '#0f0f14',
          600: '#15151c',
          500: '#1e1e26',
        },
        cyan: {
          DEFAULT: '#3B82F6', // Premium blue accent
          glow: 'rgba(59, 130, 246, 0.3)',
          light: '#60A5FA',
        },
        nebula: {
          DEFAULT: '#8B5CF6', // Violet accent
          glow: 'rgba(139, 92, 246, 0.3)',
        },
        rocket: {
          DEFAULT: '#ff6b35',
          glow: 'rgba(255, 107, 53, 0.3)',
        },
        mission: {
          green: '#00ff88',
          gold: '#ffd700',
        },
      },
      fontFamily: {
        clash: ['Clash Display', 'sans-serif'],
        general: ['General Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'], // Keep fallback
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'nebula-gradient': 'linear-gradient(135deg, #0a0f1e 0%, #0d1530 30%, #1a0a3e 60%, #0a0f1e 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)',
        'nebula-glow': '0 0 20px rgba(123, 47, 255, 0.4), 0 0 40px rgba(123, 47, 255, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.3)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
