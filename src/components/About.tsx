import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

import { Linkedin, Globe } from "lucide-react";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [founderImage, setFounderImage] = useState("https://picsum.photos/seed/founder/120/120");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/kazi-shakib-a87752250/");
  const [website, setWebsite] = useState("https://kazishakib.com");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    // Fetch Founder Image
    const q = query(collection(db, 'site_assets'), where('key', '==', 'founder_image'));
    const unsubAssets = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setFounderImage(snap.docs[0].data().image_url);
      } else {
        setFounderImage("https://picsum.photos/seed/kazi123/120/120");
      }
    });

    // Fetch Founder Links from Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.founder_linkedin) setLinkedin(data.founder_linkedin);
        if (data.founder_website) setWebsite(data.founder_website);
      }
    });

    return () => {
      unsubAssets();
      unsubSettings();
    };
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-40 px-6 relative w-full overflow-hidden bg-white/[0.02] border-t border-white/10">
      {/* Sticky Parallax Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.h2 
          style={{ y }}
          className="text-[25vw] font-display font-bold text-white/[0.08] whitespace-nowrap"
        >
          O<span className="text-mint opacity-20">X</span>ERFY
        </motion.h2>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-mint mb-12">Who We Are</h2>
          
          <p className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-[1.1] mb-16 text-white">
            "At O<span className="text-mint">x</span>erfy, our mission is to bridge the gap between complex technology and beautiful design. We build digital products that not only look stunning but perform flawlessly."
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <div className="relative">
              <img 
                src={founderImage} 
                alt="Founder" 
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover grayscale"
              />
              <div className="absolute inset-0 rounded-full border border-white/10" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl font-display text-white">Kazi Shakib</p>
              <p className="text-cream/50 uppercase tracking-wider text-xs mt-1 mb-3">Founder & Lead Developer</p>
              
              <div className="flex items-center gap-3">
                <a 
                  href={linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-white hover:bg-mint hover:border-mint transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={14} />
                </a>
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-white hover:bg-mint hover:border-mint transition-all"
                  title="Personal Website"
                >
                  <Globe size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
