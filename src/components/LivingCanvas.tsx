import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function LivingCanvas() {
  const { scrollY } = useScroll();
  
  // Parallax for dot grids
  const y1 = useTransform(scrollY, [0, 5000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -400]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-base pointer-events-none">
      {/* Aurora Blobs */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          animate={{
            x: ['-10%', '10%', '-5%', '-10%'],
            y: ['-10%', '5%', '10%', '-10%'],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle at center, rgba(7, 122, 125, 0.3) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            x: ['10%', '-10%', '5%', '10%'],
            y: ['10%', '-5%', '-10%', '10%'],
            scale: [0.9, 1.1, 1, 0.9],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle at center, rgba(0, 173, 181, 0.2) 0%, transparent 70%)' }}
        />
      </div>

      {/* Dot Grid Layer 1 (Background - slower) */}
      <motion.div 
        style={{ 
          y: y1,
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        className="absolute inset-[-50%] opacity-20"
      />

      {/* Dot Grid Layer 2 (Foreground - faster) */}
      <motion.div 
        style={{ 
          y: y2,
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)',
          backgroundSize: '80px 80px',
          backgroundPosition: '20px 20px',
        }}
        className="absolute inset-[-50%] opacity-30"
      />
    </div>
  );
}
