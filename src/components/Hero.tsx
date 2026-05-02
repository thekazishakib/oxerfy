import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Typewriter } from "./Typewriter";
import React, { useState, useEffect } from "react";

const carouselImages = [
  "https://picsum.photos/seed/hero1/600/800",
  "https://picsum.photos/seed/hero2/600/800",
  "https://picsum.photos/seed/hero3/600/800",
  "https://picsum.photos/seed/hero4/600/800",
  "https://picsum.photos/seed/hero5/600/800",
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const visibleItems = [];
  for (let i = 0; i < 4; i++) {
    visibleItems.push({
      id: index + i,
      imageIndex: (index + i) % carouselImages.length,
    });
  }

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center lg:justify-start">
      <AnimatePresence>
        {visibleItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ 
              x: 400, 
              scale: 0.6, 
              opacity: 0,
            }}
            animate={{ 
              x: i * 140, 
              scale: 1 - i * 0.15, 
              opacity: 1, 
              zIndex: 10 - i,
              borderColor: i === 0 ? "rgba(122, 226, 207, 0.8)" : "rgba(255, 255, 255, 0.1)",
            }}
            exit={{ 
              x: -100, 
              scale: 1.1, 
              opacity: 0, 
              zIndex: 11,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 w-[280px] sm:w-[320px] h-[400px] sm:h-[460px] rounded-2xl overflow-hidden shadow-2xl bg-teal border-2"
            style={{ transformOrigin: "left center" }}
          >
            <img 
              src={carouselImages[item.imageIndex]} 
              alt={`Slide ${item.id}`} 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }} // Delay for preloader
          className="text-left"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-display font-bold leading-[0.9] mb-8 tracking-[-0.05em]">
            We make<br />
            businesses<br />
            <span className="text-mint block mt-2">
              <Typewriter phrases={["visible.", "digital.", "unstoppable."]} delay={3000} />
            </span>
          </h1>
          
          <p className="text-cream/60 text-xl md:text-2xl mb-12 max-w-xl font-light">
            We build digital assets that grow your business. Fast, secure, and beautiful.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <button className="bg-teal text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal/90 transition-colors flex items-center gap-2 group cursor-none">
              Start a Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border border-mint text-mint px-8 py-4 rounded-full font-bold text-lg hover:bg-mint/10 transition-colors cursor-none">
              View Our Work
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="relative hidden lg:block ml-12"
        >
          <HeroCarousel />
        </motion.div>

      </div>
    </section>
  );
}
