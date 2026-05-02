import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2000); // 0.8s line + 0.6s text + buffer
    return () => clearTimeout(timer);
  }, [onComplete]);

  const text = "OXERFY";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          {/* Horizontal Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute h-[1px] w-full bg-white/20 origin-left"
          />

          {/* Text */}
          <div className="relative flex overflow-hidden">
            {text.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + (i * 0.05), // Starts after line draws
                  type: "spring",
                  bounce: 0.4
                }}
                className={`text-6xl md:text-8xl font-display font-bold tracking-widest ${char.toUpperCase() === 'X' ? 'text-mint' : 'text-white'}`}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
