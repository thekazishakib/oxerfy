"use client";

import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-cream/80';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm font-medium';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className={`group relative inline-block overflow-hidden h-5 flex items-center gap-2 ${textSizeClass} cursor-none`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'site_assets'), where('key', '==', 'logo_image'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLogoUrl(snapshot.docs[0].data().image_url);
      } else {
        setLogoUrl(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-2xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = logoUrl ? (
    <div className="flex items-center gap-2">
      <img src={logoUrl} alt="Oxerfy Logo" className="h-8 w-auto object-contain" />
      <span className="font-display font-bold tracking-widest text-white text-lg">O<span className="text-mint">X</span>ERFY</span>
    </div>
  ) : (
    <div className="font-display font-bold tracking-widest text-white text-lg">
      O<span className="text-mint">X</span>ERFY
    </div>
  );

  const navLinksData = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const ctaButtonElement = (
    <div className="relative group w-full sm:w-auto">
       <div className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-mint
                     opacity-40 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
       <a href="#contact" onClick={handleCtaClick} className="relative z-10 px-6 py-2.5 sm:px-6 text-xs sm:text-sm font-bold text-base bg-white rounded-full hover:bg-cream transition-all duration-200 w-full sm:w-auto inline-block text-center cursor-none whitespace-nowrap">
         Let's Talk
       </a>
    </div>
  );

  return (
      <header className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-6 py-3 backdrop-blur-xl
                       ${headerShapeClass}
                       border border-white/10 bg-white/5
                       w-[calc(100%-2rem)] sm:w-[95%] lg:w-full
                       ${isScrolled ? 'max-w-[850px]' : 'max-w-[1200px]'}
                       transition-all duration-500 ease-in-out shadow-2xl`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden sm:flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm max-w-[70vw] lg:max-w-none">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          {ctaButtonElement}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none cursor-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  const target = document.querySelector(link.href);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsOpen(false);
                }
              }}
              className="flex items-center gap-2 text-cream/80 hover:text-white transition-colors w-full justify-center cursor-none font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {ctaButtonElement}
        </div>
      </div>
    </header>
  );
}
