import { motion } from "motion/react";
import { Zap, ShieldCheck, Code, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

const reasons = [
  { title: "Fast Delivery", desc: "We respect your time and hit our deadlines.", icon: Zap },
  { title: "Secure by Default", desc: "Best practices in security and data protection.", icon: ShieldCheck },
  { title: "24/7 Support", desc: "We're here when you need us, post-launch.", icon: Clock },
];

export function WhyChooseUs() {
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/seed/workspace/800/1000");

  useEffect(() => {
    const q = query(collection(db, 'site_assets'), where('key', '==', 'why_choose_us_1'));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setImageUrl(snap.docs[0].data().image_url);
      } else {
        setImageUrl("https://picsum.photos/seed/workspace/800/1000");
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="whyus" className="py-32 px-6 bg-base text-cream border-t border-white/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">Why Choose Us</h2>
          <p className="text-cream/60 text-xl mb-12 max-w-md font-light">
            We don't just build websites; we build digital assets that grow your business. Here is why clients trust us.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {reasons.map((reason, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-mint flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <reason.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{reason.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed font-light">{reason.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 mb-16 md:mb-0">
            <img 
              src={imageUrl} 
              alt="Workspace" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-12 -left-4 md:-bottom-10 md:-left-10 bg-mint text-base p-6 md:p-10 rounded-[2rem] max-w-[85%] md:max-w-sm shadow-2xl"
          >
            <p className="text-5xl md:text-6xl font-display font-bold mb-2 md:mb-4 tracking-tighter">100%</p>
            <p className="font-medium text-base md:text-lg leading-snug">Client Satisfaction Rate across all our delivered projects.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
