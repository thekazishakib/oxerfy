import React, { useEffect, useRef, useState } from 'react';
import { SkeletonCard } from './ui/Skeleton';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

gsap.registerPlugin(ScrollTrigger);

export const defaultProjects = [
  {
    title: "RinishBD",
    type: "Meta Ads & Strategy",
    image: "https://picsum.photos/seed/rinishbd/800/1000",
    link: "https://www.facebook.com/rinishbd",
    description: "For RinishBD, we overhauled their Meta advertising strategy, injecting a creative approach that completely transformed their ad management. This targeted optimization led to a massive spike in conversions. Client Review: \"Kazi completely transformed my Meta ad management... My conversions are up significantly, highly recommend!\"",
  },
  {
    title: "ShajAlo",
    type: "Organic Viral Growth",
    image: "https://picsum.photos/seed/shajalo/800/1000",
    link: "https://www.facebook.com/SajhAlo",
    description: "In the highly competitive furniture niche, we crafted an organic viral video strategy for ShajAlo. We successfully produced and launched 5 videos that went massively viral—achieving 1.0M to 1.6M views each organically. This explosive visibility directly translated into 50+ high-value confirmed orders.",
  },
  {
    title: "Aurazeh",
    type: "AI Automation",
    image: "https://picsum.photos/seed/aurazeh/800/1000",
    link: "https://www.facebook.com/Aurazeh/",
    description: "We modernized Aurazeh's digital presence by implementing a flawless AI automation pipeline using Make.com. This sophisticated system handles automated Facebook posting, instant conversational AI message replies, and streamlined customer interactions, drastically reducing manual workload and boosting response rates.",
  },
  {
    title: "ApproLeader",
    type: "Full-Stack & Marketing",
    image: "https://picsum.photos/seed/apporleader/800/1000",
    link: "https://apporleader.vercel.app/",
    description: "Serving as the foundational technology and marketing partner for ApproLeader, we provided end-to-end solutions. We built their complete web infrastructure, orchestrated targeted Meta advertising campaigns, and executed a robust LinkedIn growth strategy to establish strong market authority for the founder.",
  },
  {
    title: "Website: Nusrat Jahan",
    type: "Portfolio Web Development",
    image: "https://picsum.photos/seed/nusrat/800/1000",
    link: "https://thenusratjahan.vercel.app/",
    description: "Created a highly personalized portfolio web experience for Nusrat Jahan. We designed and developed a bespoke WordPress landing page, then skillfully extracted and optimized the source code for a lightning-fast, modern deployment directly on Vercel's global edge network.",
  },
  {
    title: "Website: Zayed Ahammed",
    type: "Portfolio Web Development",
    image: "https://picsum.photos/seed/zayed/800/1000",
    link: "https://zayedahammed.vercel.app/",
    description: "Developed a sleek, conversion-focused personal portfolio website for Zayed Ahammed. By building the initial framework in WordPress and strategically exporting the static code, we ensured a high-performance, seamless live deployment utilizing Vercel's modern hosting infrastructure.",
  },
  {
    title: "Colour Fusion",
    type: "Meta Page Management & Ads",
    image: "https://picsum.photos/seed/colourfution/800/1000",
    link: "#",
    description: "We spearheaded the digital launch for Colour Fusion from the ground up. This included complete Meta page architecture and robust ongoing management. By designing 20+ engaging content pieces and executing highly targeted ad campaigns, we quickly established their social proof and brand awareness.",
  }
];

export function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            image: data.image_url || data.image
          };
        }));
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Wait until real project cards are rendered, not skeletons
    if (loading) return;

    const section = sectionRef.current;
    const scroll = scrollRef.current;

    if (!section || !scroll) return;

    // Small delay to let DOM settle after projects render
    const timer = setTimeout(() => {
      let ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          ScrollTrigger.refresh();
          gsap.to(scroll, {
            x: () => {
              const amount = scroll.scrollWidth - window.innerWidth;
              return amount > 0 ? -amount : 0;
            },
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              end: () => {
                const amount = scroll.scrollWidth - window.innerWidth;
                return "+=" + (amount > 0 ? amount : 1);
              }
            }
          });
        });
      }, section);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <section id="work" ref={sectionRef} className="relative w-full md:h-[100dvh] md:min-h-[700px] 2xl:min-h-[850px] overflow-hidden z-10 bg-[#0B192C] border-t border-white/10 flex flex-col py-16 md:py-0">
      <div className="px-6 md:pt-20 md:pl-20 z-20 shrink-0 mb-10 md:mb-0">
        <h2 className="text-5xl md:text-7xl font-display font-bold">Selected Work</h2>
      </div>
      
      <div className="flex-1 overflow-visible flex md:items-center">
        <div ref={scrollRef} className="flex flex-col md:flex-row w-full md:w-max md:items-center px-6 md:px-20 gap-8 md:gap-12">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full md:w-[420px] md:h-[560px] flex-shrink-0">
                  <SkeletonCard />
                </div>
              ))
            : projects.map((project, i) => (
                <ProjectCard key={i} project={project} index={i} />
              ))
          }
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;
    
    // Create quickTo instances for much higher performance
    const xTo = gsap.quickTo(cardRef.current, "rotateY", { ease: "power2.out", duration: 0.5 });
    const yTo = gsap.quickTo(cardRef.current, "rotateX", { ease: "power2.out", duration: 0.5 });
    const imgXTo = gsap.quickTo(imageRef.current, "x", { ease: "power2.out", duration: 0.5 });
    const imgYTo = gsap.quickTo(imageRef.current, "y", { ease: "power2.out", duration: 0.5 });

    // Store them on the ref so we can use them in the event handlers
    (cardRef.current as any).xTo = xTo;
    (cardRef.current as any).yTo = yTo;
    (cardRef.current as any).imgXTo = imgXTo;
    (cardRef.current as any).imgYTo = imgYTo;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !imageRef.current || window.innerWidth < 768) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const currentCard = cardRef.current as any;
    if (currentCard.xTo) {
      currentCard.xTo(rotateY);
      currentCard.yTo(rotateX);
      currentCard.imgXTo((x - centerX) * -0.05);
      currentCard.imgYTo((y - centerY) * -0.05);
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imageRef.current || window.innerWidth < 768) return;
    
    const currentCard = cardRef.current as any;
    if (currentCard.xTo) {
      currentCard.xTo(0);
      currentCard.yTo(0);
      currentCard.imgXTo(0);
      currentCard.imgYTo(0);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const animationProps = isMobile ? {
    initial: { y: 50, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as any }
  } : {
    initial: { x: -100 * index, y: 50, opacity: 0, rotateZ: -5 + index * 2 },
    whileInView: { x: 0, y: 0, opacity: 1, rotateZ: 0 },
    transition: { duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as any }
  };

  return (
    <motion.div 
      initial={animationProps.initial}
      whileInView={animationProps.whileInView}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
      transition={animationProps.transition}
      className="w-full md:w-[480px] lg:w-[500px] xl:w-[600px] 2xl:w-[750px] h-auto md:h-[65vh] md:min-h-[450px] md:max-h-[850px] flex-shrink-0"
      style={{ perspective: '1000px' }}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card w-full h-full flex flex-col overflow-hidden group"
      >
        <a 
          href={project.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="h-[250px] md:h-[55%] shrink-0 overflow-hidden relative border-b border-white/10 block group/image cursor-pointer"
        >
          <img 
            ref={imageRef}
            src={project.image} 
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-80 group-hover/image:opacity-100 transition-all duration-500 group-hover/image:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="bg-mint text-[#0B192C] px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_30px_rgba(0,255,180,0.3)] translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300 flex items-center gap-2">
               View Live Link <span>→</span>
             </div>
          </div>
        </a>
        <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 overflow-hidden" style={{ color: "white" }}>
          <div className="flex-1 min-h-0">
            <p className="text-mint text-xs md:text-sm uppercase tracking-widest font-medium mb-1.5 drop-shadow-md">{project.type}</p>
            <h3 className="text-2xl md:text-4xl font-display font-bold mb-2 md:mb-3 drop-shadow-lg truncate" style={{ color: "white" }}>{project.title}</h3>
            {project.description && (
              <p className="text-sm md:text-base line-clamp-4 md:line-clamp-none font-medium leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.9)" }}>{project.description}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
