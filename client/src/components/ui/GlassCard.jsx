import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', variant = 'default', hover = true, animate = true }) {
  const variants = {
    default: 'glass-card',
    cyan:    'glass-card-cyan',
    nebula:  'glass-card-nebula',
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`${variants[variant]} ${className} ${hover ? 'cursor-default' : ''}`}
    >
      {children}
    </motion.div>
  );
}
