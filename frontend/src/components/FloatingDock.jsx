import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingDock = () => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const dockItems = [
    {
      path: '/jobs',
      label: 'Find Jobs',
      icon: Search,
      gradient: 'from-[#2F80ED] to-[#00C6FF]', // Premium Apple blue/cyan gradient
      glow: 'shadow-blue-500/40'
    },
    {
      path: '/resume-match',
      label: 'Match Resume',
      icon: Sparkles,
      gradient: 'from-[#a8ff78] to-[#78ffd6]', // Or a vibrant purple/pink:
      gradient: 'from-[#8A2387] via-[#E94057] to-[#F27121]', // Premium Apple purple/orange gradient
      glow: 'shadow-pink-500/40'
    }
  ];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-full max-w-max px-4">
      <motion.div 
        initial={{ opacity: 0, y: -15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-end gap-3 px-3 py-2 bg-white dark:bg-zinc-900/60 backdrop-blur-3xl border border-white/80 dark:border-white/5 rounded-[1.2rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
      >
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/0 to-transparent pointer-events-none rounded-[1.2rem]" />

        {dockItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isHovered = hoveredIndex === idx;

          // Scale dynamics based on hover state
          let scale = 1;
          let y = 0;
          if (isHovered) {
            scale = 1.3;
            y = -10;
          } else if (hoveredIndex !== null) {
            // Adjacent elements scale up slightly (macOS Dock zoom effect)
            scale = 1.08;
            y = -2;
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center cursor-pointer select-none"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* macOS Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                    exit={{ opacity: 0, y: 8, scale: 0.8, x: '-50%' }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute -top-10 left-1/2 bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-white/15 dark:border-zinc-200/50 whitespace-nowrap z-50 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-zinc-900/90 dark:after:border-t-white/95"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Squirclish macOS App Icon */}
              <motion.div
                animate={{ scale, y }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className={`w-10 h-10 flex items-center justify-center rounded-[0.8rem] bg-gradient-to-tr ${item.gradient} text-white shadow-md hover:shadow-lg relative overflow-hidden transition-shadow`}
              >
                {/* Subtle glare on icon */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

                <Icon className="h-5 w-5 relative z-10" />
              </motion.div>

              {/* Small glowing iOS style dot */}
              <div className="h-2 flex items-center justify-center mt-1">
                {isActive ? (
                  <motion.div
                    layoutId="activeDot"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
                  />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                )}
              </div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FloatingDock;
