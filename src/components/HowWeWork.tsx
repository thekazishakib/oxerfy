import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const steps = [
  { label: "Discuss", desc: "We understand your goals and requirements." },
  { label: "Plan", desc: "We map out the architecture and design." },
  { label: "Build", desc: "We develop with clean, scalable code." },
  { label: "Launch", desc: "We deploy and monitor for success." },
];

export function HowWeWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section className="py-32 px-6 bg-base overflow-hidden relative z-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            How We Work
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-cream/60 text-xl font-light"
          >
            A simple, transparent process.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Animated SVG Line */}
          <div className="absolute top-12 left-[10%] right-[10%] h-1 hidden md:block z-0">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="rgba(245, 238, 221, 0.1)" strokeWidth="2" strokeDasharray="8 8" />
              <motion.line 
                x1="0" y1="2" x2="100%" y2="2" 
                stroke="var(--color-mint)" 
                strokeWidth="2" 
                style={{ pathLength }}
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center group"
              >
                <div className="w-24 h-24 mx-auto glass-card rounded-full flex items-center justify-center mb-8 relative shadow-xl transition-colors duration-500 group-hover:border-mint/50">
                  <span className="text-3xl font-display font-bold text-mint group-hover:scale-110 transition-transform duration-500">
                    0{index + 1}
                  </span>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-mint/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display">{step.label}</h3>
                <p className="text-cream/50 leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
