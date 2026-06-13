import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

export default function StatCounter({ value, suffix = '', prefix = '', label, color = 'cyan', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const displayRef = useRef(null);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      }
    });
  }, [spring, prefix, suffix, decimals]);

  const colorMap = {
    cyan:   'text-cyan text-glow-cyan',
    green:  'text-mission-green text-glow-green',
    nebula: 'text-nebula text-glow-nebula',
    gold:   'text-mission-gold',
    rocket: 'text-rocket',
  };

  return (
    <div ref={ref} className="text-center">
      <div ref={displayRef} className={`font-mono text-4xl md:text-5xl font-bold tracking-tight ${colorMap[color] || colorMap.cyan}`}>
        {prefix}0{suffix}
      </div>
      <p className="text-sm text-white/50 mt-2 font-heading tracking-wide">{label}</p>
    </div>
  );
}
