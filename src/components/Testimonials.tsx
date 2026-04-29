import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TestimonialsColumn } from './ui/testimonials-columns-1';
import { Facebook, BadgeCheck } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const defaultTestimonials = [
  {
    text: "Oxerfy is a great team! Ora amar Instagram page er ekta boro problem fix kore diyeche. Plus, tara amar jonno besh kichu cool custom edits o kore diyeche. Khub e helpful and talented ekta agency. Highly appreciated!",
    image: "/regenerated_image_1777372990808.png",
    name: "Adnan",
    role: "Client",
  },
  {
    text: "Great job Kazi!! Amar personal website ta eto sundor hobe bhabte pari nai. The whole process was so smooth, and apni amar shob requirement khub carefully shune kaj korechen. I am really happy with the final result!",
    image: "/regenerated_image_1777372992402.png",
    name: "Nusrat Jahan",
    role: "Personal Website",
  },
  {
    text: "Kazi at Oxerfy completely transformed my Meta ad management with his creative approach. Oader kaaj er dhoron khub e professional. Amar page er conversions aager cheye onek bereche. Anyone needing real results shouldn't think twice. Thank you so much for the amazing support!",
    image: "/regenerated_image_1777372993380.png",
    name: "Nasrin Sarkar",
    role: "Founder, RinishBD",
  },
  {
    text: "Thank you Kazi for the amazing personal portfolio! Design ta khub e sundor ar fast hoyeche. Ekdom amar moner moto kore baniye diyechen. Highly recommended. Wish you and Oxerfy grow up faster!",
    image: "/regenerated_image_1777372994150.png",
    name: "Zayed Ahammed",
    role: "Personal Portfolio",
  },
  {
    text: "First to last, Kazi bhai amake amar cousin er page setup and management e help korechen. Kono dhoroner birokti charai bhai continuously support diyechen. Really grateful for their dedication and top-notch service!",
    image: "https://i.pravatar.cc/150?u=ashikul",
    name: "Ashikul Rahman",
    role: "Client",
  },
  {
    text: "He is honestly a great guy to work with! Kaaj er pasapasi Kazi bhaiyer behavior o onek bhalo. He goes out of his way to help you out. Thank you so much for the excellent service!",
    image: "https://i.pravatar.cc/150?u=afridi",
    name: "Afridi",
    role: "Client",
  },
  {
    text: "Their service is simply the best! Ekdom time er moddhe perfect ekta kaaj deliver koreche. The attention to detail is amazing. Next time apni i shobar aage amar first choice thakben.",
    image: "https://i.pravatar.cc/150?u=tanjim",
    name: "Tanjim Parvez",
    role: "Client",
  },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>(defaultTestimonials);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snap) => {
      setTestimonials(snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          image: data.image_url || data.image
        };
      }));
    });
    return () => unsub();
  }, []);

  const firstColumn = testimonials.slice(0, Math.ceil(testimonials.length / 3));
  const secondColumn = testimonials.slice(Math.ceil(testimonials.length / 3), Math.ceil(testimonials.length * 2 / 3));
  const thirdColumn = testimonials.slice(Math.ceil(testimonials.length * 2 / 3));
  return (
    <section id="testimonials" className="py-32 relative z-10 overflow-hidden">
      <div className="max-w-[95vw] 2xl:max-w-[1600px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">Client Stories</h2>
          <p className="text-cream/60 text-xl max-w-2xl mx-auto font-light">
            Don't just take our word for it. Here's what our partners have to say.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 md:gap-8 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex justify-center pb-8"
        >
          <a 
            href="https://facebook.com/oxerfy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(24,119,242,0.25)] hover:shadow-[0_0_40px_rgba(24,119,242,0.4)] hover:-translate-y-1"
          >
            <Facebook className="w-5 h-5 fill-current" />
            <span className="font-display tracking-wide">Verify Our Reviews on Facebook</span>
            <BadgeCheck className="w-5 h-5 text-blue-200" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
