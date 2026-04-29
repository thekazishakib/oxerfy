"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: React.ReactNode; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 rounded-3xl border border-white/10 shadow-lg shadow-black/20 max-w-sm md:max-w-md w-full glass-card" key={i}>
                  <div className="text-cream/90 font-light leading-relaxed">{text}</div>
                  <div className="flex items-center gap-4 mt-8">
                    <img
                      width={48}
                      height={48}
                      src={image}
                      alt={name}
                      className="h-12 w-12 rounded-full object-cover border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold font-display text-lg text-cream">{name}</div>
                      <div className="text-mint text-sm">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
