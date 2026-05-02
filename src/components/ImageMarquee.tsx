import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultRow1 = [
  "https://picsum.photos/seed/g1/400/300",
  "https://picsum.photos/seed/g2/400/300",
  "https://picsum.photos/seed/g3/400/300",
  "https://picsum.photos/seed/g4/400/300",
  "https://picsum.photos/seed/g5/400/300",
  "https://picsum.photos/seed/g6/400/300",
];

const defaultRow2 = [
  "https://picsum.photos/seed/g7/400/300",
  "https://picsum.photos/seed/g8/400/300",
  "https://picsum.photos/seed/g9/400/300",
  "https://picsum.photos/seed/g10/400/300",
  "https://picsum.photos/seed/g11/400/300",
  "https://picsum.photos/seed/g12/400/300",
];

const defaultRow3 = [
  "https://picsum.photos/seed/g13/400/300",
  "https://picsum.photos/seed/g14/400/300",
  "https://picsum.photos/seed/g15/400/300",
  "https://picsum.photos/seed/g16/400/300",
  "https://picsum.photos/seed/g17/400/300",
  "https://picsum.photos/seed/g18/400/300",
];

export function ImageMarquee() {
  const [row1, setRow1] = useState(defaultRow1);
  const [row2, setRow2] = useState(defaultRow2);
  const [row3, setRow3] = useState(defaultRow3);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gallery'), (snap) => {
      const urls = snap.docs.map(doc => doc.data().image_url as string);
      if (urls.length >= 3) {
        const partSize = Math.ceil(urls.length / 3);
        setRow1(urls.slice(0, partSize) || defaultRow1);
        setRow2(urls.slice(partSize, partSize * 2) || defaultRow2);
        setRow3(urls.slice(partSize * 2) || defaultRow3);
      } else {
        setRow1(urls);
        setRow2(urls);
        setRow3(urls);
      }
    });

    return () => unsub();
  }, []);
  return (
    <section id="gallery" className="py-24 bg-base overflow-hidden w-full border-t border-white/10 flex flex-col gap-6">
      <div className="mb-8 text-center max-w-2xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-cream mb-4 tracking-tight">Recent Deliveries</h2>
          <p className="text-cream/60 font-light text-lg">A sneak peek at some of our favorite creations.</p>
        </motion.div>
      </div>

      <div className="relative w-full flex flex-col gap-6 my-10 -rotate-3 scale-[1.05]">
        {/* Row 1 - Left to Right (Reverse) */}
        <div className="flex w-full overflow-hidden">
          <div className="flex w-max animate-marquee-reverse gap-6 hover:[animation-play-state:paused]" style={{ animationDuration: '60s' }}>
            {[...row1, ...row1].map((src, i) => (
              <div key={`r1-${i}`} className="w-[280px] sm:w-[380px] h-[180px] sm:h-[260px] shrink-0 rounded-3xl overflow-hidden border border-white/10 bg-white/5 relative">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]" style={{ animationDuration: '45s' }}>
            {[...row2, ...row2].map((src, i) => (
              <div key={`r2-${i}`} className="w-[280px] sm:w-[380px] h-[180px] sm:h-[260px] shrink-0 rounded-3xl overflow-hidden border border-white/10 bg-white/5 relative">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Left to Right (Reverse) */}
        <div className="flex w-full overflow-hidden">
          <div className="flex w-max animate-marquee-reverse gap-6 hover:[animation-play-state:paused]" style={{ animationDuration: '55s' }}>
            {[...row3, ...row3].map((src, i) => (
              <div key={`r3-${i}`} className="w-[280px] sm:w-[380px] h-[180px] sm:h-[260px] shrink-0 rounded-3xl overflow-hidden border border-white/10 bg-white/5 relative">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
