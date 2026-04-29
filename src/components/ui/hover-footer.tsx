"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-none", className)}
      data-cursor="click"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#7AE2CF" />
              <stop offset="50%" stopColor="#077A7D" />
              <stop offset="100%" stopColor="#F5EEDD" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-display text-7xl font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text.split('').map((char, i) => (
          <tspan 
            key={i} 
            fill={char.toUpperCase() === 'X' ? '#00adb5' : 'transparent'} 
            stroke={char.toUpperCase() === 'X' ? '#00adb5' : 'rgba(255,255,255,0.1)'}
          >
            {char}
          </tspan>
        ))}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-display text-7xl font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text.split('').map((char, i) => (
          <tspan 
            key={i} 
            fill={char.toUpperCase() === 'X' ? '#00adb5' : 'transparent'} 
            stroke={char.toUpperCase() === 'X' ? '#00adb5' : '#7AE2CF'}
          >
            {char}
          </tspan>
        ))}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-display text-7xl font-bold"
      >
        {text.split('').map((char, i) => (
          <tspan 
            key={i} 
            fill={char.toUpperCase() === 'X' ? '#00adb5' : 'transparent'} 
            stroke={char.toUpperCase() === 'X' ? '#00adb5' : 'url(#textGradient)'}
          >
            {char}
          </tspan>
        ))}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-color-dodge transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(0, 0, 0, 0.4) 40%, rgba(122, 226, 207, 0.3) 80%, rgba(7, 122, 125, 0.4) 100%)",
      }}
    />
  );
};
