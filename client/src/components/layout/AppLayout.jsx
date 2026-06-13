import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StarfieldBackground from './StarfieldBackground';

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <StarfieldBackground starCount={150} />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
