import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

const DEFAULT_PACKAGES = [
  {
    name: "Starter", priceUSD: "$499", priceBDT: "৳54,900", desc: "15 days turnaround time.", highlight: false,
    features: ["Social Media Customize (Fb, Insta, Linkedin, Pinterest) (no paid Ads)", "Creative Post make (single image 5 times, 2 times carousel)", "Base Design Customize using Canva (Custom fonts not included)", "Wordpress Website (Landing Page only)", "Basic SEO"],
  },
  {
    name: "Professional", priceUSD: "$999 - $1499", priceBDT: "৳1,09,890 - ৳1,64,890", desc: "1-2 months turnaround time.", highlight: true,
    features: ["Social Media Customize (Fb, Insta, Linkedin, Pinterest) (Paid ads with client budget)", "Base Design Customize using Canva", "Creative Post make (single image 10x, 5x carousel, 2 reels)", "Advance SEO", "Wordpress Website (Landing Page only)", "Make.com or Zapier one AI Automation (Custom medium range)"],
  },
  {
    name: "Customize", priceUSD: "Custom", priceBDT: "Custom", desc: "3 - 6 months max turnaround time.", highlight: false,
    features: ["Enterprise level architecture & design", "Full custom branding and assets", "Complex AI automation workflows", "Advanced SEO & performance scaling", "Dedicated account management"],
  },
];

export function Pricing() {
  const [currency, setCurrency] = useState<'USD' | 'BDT'>('USD');
  const [packages, setPackages] = useState<any[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pricing'), (snap) => {
      if (!snap.empty) {
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        setPackages(data);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="pricing" className="py-32 px-6 bg-base border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 text-cream">Simple Pricing</h2>
          <p className="text-cream/60 text-xl font-light mb-10">Transparent packages for every stage of growth.</p>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full">
            <button onClick={() => setCurrency('USD')} className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${currency === 'USD' ? 'bg-mint text-base' : 'text-cream/60 hover:text-cream'}`}>USD</button>
            <button onClick={() => setCurrency('BDT')} className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${currency === 'BDT' ? 'bg-mint text-base' : 'text-cream/60 hover:text-cream'}`}>BDT</button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id || i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`p-8 xl:p-10 rounded-[2.5rem] border ${pkg.highlight ? 'bg-mint text-base border-mint z-10 scale-100 lg:scale-[1.02]' : 'bg-white/5 border-white/10 text-cream'} relative flex flex-col group hover:-translate-y-2 transition-transform duration-500 shadow-2xl`}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-base text-mint text-xs font-bold uppercase tracking-widest py-2 px-6 rounded-full border border-mint/20 shadow-xl whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <h3 className="text-3xl font-display font-bold mb-4">{pkg.name}</h3>
              <p className={`mb-8 font-medium text-sm tracking-wide ${pkg.highlight ? 'text-base/80' : 'text-cream/60'}`}>{pkg.desc}</p>
              <div className="text-5xl lg:text-4xl xl:text-5xl font-display font-bold mb-10 tracking-tighter">
                {currency === 'USD' ? pkg.priceUSD : pkg.priceBDT}
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {(pkg.features || []).map((feature: string, j: number) => (
                  <li key={j} className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.highlight ? 'bg-base/20' : 'bg-mint/20'}`}>
                      <Check className={`w-4 h-4 ${pkg.highlight ? 'text-base' : 'text-mint'}`} />
                    </div>
                    <span className={`font-light leading-snug ${pkg.highlight ? 'text-base/90' : 'text-cream/80'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${pkg.highlight ? 'bg-base text-mint hover:bg-base/90' : 'bg-white/10 text-cream hover:bg-white/20 border border-white/5'}`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="mt-16 text-center"
        >
           <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-5 rounded-3xl border-2 border-mint/40 bg-mint/10 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,180,0.15)] relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mint/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
             <div className="flex items-center justify-center p-2.5 bg-mint rounded-full text-[#0B192C] shrink-0 shadow-[0_0_15px_rgba(0,255,180,0.5)]">
               <Sparkles className="w-5 h-5 fill-current" />
             </div>
             <p className="text-cream font-medium text-base md:text-lg tracking-wide text-center sm:text-left">
               <span className="text-mint font-bold block sm:inline sm:mr-2">Standalone Options Available!</span> 
               Every service listed above can be requested individually.
             </p>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
