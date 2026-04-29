import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_SERVICES = [
  { title: "WordPress Web", category: "Development", description: "Lightning-fast, custom WordPress websites built for scale and performance.", accent: "hover:border-l-blue-500" },
  { title: "AI Automation", category: "Engineering", description: "Intelligent workflows and AI agents that put your business operations on autopilot.", accent: "hover:border-l-purple-500" },
  { title: "Meta Marketing", category: "Growth", description: "Data-driven ad campaigns that maximize ROI and scale your customer acquisition.", accent: "hover:border-l-orange-500" },
  { title: "Social Media Management", category: "Marketing", description: "Engaging content strategies and community management to grow your brand presence.", accent: "hover:border-l-pink-500" },
  { title: "SME Digitalize", category: "Transformation", description: "Complete digital transformation solutions tailored for small and medium enterprises.", accent: "hover:border-l-yellow-500" },
  { title: "Post Design", category: "Design", description: "Eye-catching and professional social media post designs using Canva.", accent: "hover:border-l-mint" },
];

export function Services() {
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        setServices(data);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="services" className="py-32 px-6 relative z-10 bg-black rounded-b-[40px] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-hidden mb-20">
          <motion.h2 
            initial={{ x: '-100%' }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-display font-bold"
          >
            Our
          </motion.h2>
          <motion.h2 
            initial={{ x: '100%' }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-display font-bold ml-4"
          >
            Services
          </motion.h2>
        </div>
        <div className="flex flex-col border-t border-white/10">
          {services.map((service, index) => (
            <ServiceRow key={service.id || index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isVisible = isMobile || isHovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group border-b border-white/10 border-l-4 border-l-transparent ${service.accent} transition-all duration-400 cursor-none`}
      style={{ backgroundColor: isHovered ? 'rgba(255,255,255,0.02)' : 'transparent' }}
      data-cursor="click"
    >
      <div className="py-8 px-6 flex items-center justify-between">
        <h3 className="text-3xl md:text-5xl font-display font-bold">{service.title}</h3>
        <div className="flex items-center gap-8">
          <span className="hidden md:block text-cream/40 uppercase tracking-widest text-sm font-medium">{service.category}</span>
          <motion.div
            animate={{ rotate: isHovered ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-base transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-xl text-cream/70 max-w-2xl font-light">{service.description}</p>
              <button className="text-mint font-medium hover-underline self-start md:self-auto">Learn More</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
