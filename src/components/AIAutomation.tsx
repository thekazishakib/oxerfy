import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AIAutomation() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center py-32 px-6 overflow-hidden z-10 bg-[#031016]">
      {/* Canvas Background */}
      <NeuralNetworkCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 md:p-16 text-center shadow-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Your business,<br />
            <span className="text-mint">running on autopilot.</span>
          </h2>
          <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-light">
            We build intelligent workflows and AI agents that handle the repetitive tasks, so you can focus on growth.
          </p>

          <ProcessLoop />
        </motion.div>
      </div>
    </section>
  );
}

function ProcessLoop() {
  const steps = [
    "Lead comes in",
    "AI Agent responds",
    "Task created",
    "Done"
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="relative w-full md:w-auto">
            <div 
              className={`px-6 py-4 rounded-xl border transition-all duration-500 ${
                index === currentStep 
                  ? 'bg-teal/20 border-mint text-mint shadow-[0_0_20px_rgba(122,226,207,0.2)]' 
                  : 'bg-white/5 border-white/10 text-cream/50'
              }`}
            >
              <p className="font-medium whitespace-nowrap">{step}</p>
            </div>
            
            {/* Active Indicator Glow */}
            {index === currentStep && (
              <motion.div
                layoutId="activeGlow"
                className="absolute inset-0 rounded-xl bg-mint/10 blur-md -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
          
          {/* Arrow */}
          {index < steps.length - 1 && (
            <div className="hidden md:block text-white/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          )}
          {index < steps.length - 1 && (
            <div className="block md:hidden text-white/20 rotate-90">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    // Node class
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(122, 226, 207, 0.5)';
        ctx.fill();
      }
    }

    const nodes: Node[] = [];
    const numNodes = Math.floor((width * height) / 15000); // Responsive density

    for (let i = 0; i < numNodes; i++) {
      nodes.push(new Node());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            // Opacity based on distance
            const opacity = 1 - (distance / 150);
            
            // Pulse effect based on time
            const time = Date.now() * 0.001;
            const pulse = Math.sin(time * 2 + i + j) * 0.5 + 0.5;
            
            // Mix base color with pulse color
            const alpha = opacity * (0.1 + pulse * 0.3);
            
            ctx.strokeStyle = `rgba(122, 226, 207, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
