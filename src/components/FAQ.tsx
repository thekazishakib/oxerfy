import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_FAQS = [
  { question: "What services do you offer?", answer: "We offer a comprehensive suite of digital services including web development, UI/UX design, AI automation, and custom software solutions tailored to your business needs." },
  { question: "How long does a typical project take?", answer: "Project timelines vary depending on complexity. A standard website might take 2-4 weeks, while a complex web application could take 2-3 months. We provide detailed timelines during our initial consultation." },
  { question: "Do you provide ongoing support after launch?", answer: "Yes! We offer various maintenance and support packages to ensure your digital assets remain secure, up-to-date, and perform optimally long after the initial launch." },
  { question: "What is your pricing structure?", answer: "Our pricing is project-based, tailored to your specific requirements. We offer transparent pricing with no hidden fees. Contact us for a custom quote based on your needs." },
  { question: "Can you help improve my existing website?", answer: "Absolutely. We often help clients revamp their existing digital presence, improving performance, updating the design, and adding new features or AI integrations." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'faqs'), (snap) => {
      if (!snap.empty) {
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        setFaqs(data);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-32 px-6 relative z-10 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-cream/60 text-xl font-light">Everything you need to know about working with us.</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card overflow-hidden transition-colors duration-300 ${isOpen ? 'border-mint/30' : 'border-white/10'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-none"
                >
                  <span className="text-xl md:text-2xl font-display font-bold pr-8">{faq.question}</span>
                  <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-300 ${isOpen ? 'bg-mint text-base border-mint' : 'border-white/20 text-cream'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-8 text-cream/70 text-lg font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
