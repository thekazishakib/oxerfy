import { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export function TextScramble({ text, className = '', delay = 0 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const frameRef = useRef<number>(0);
  const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number; char?: string }>>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const update = () => {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = queueRef.current.length; i < n; i++) {
        let { from, to, start, end, char } = queueRef.current[i];
        
        if (frameCountRef.current >= end) {
          complete++;
          output += to;
        } else if (frameCountRef.current >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            queueRef.current[i].char = char;
          }
          output += `<span class="text-brand/70">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      setDisplayText(output);
      
      if (complete === queueRef.current.length) {
        cancelAnimationFrame(frameRef.current);
      } else {
        frameRef.current = requestAnimationFrame(update);
        frameCountRef.current++;
      }
    };

    const startAnimation = () => {
      const length = Math.max(0, text.length);
      queueRef.current = [];
      for (let i = 0; i < length; i++) {
        const from = '';
        const to = text[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        queueRef.current.push({ from, to, start, end });
      }
      frameCountRef.current = 0;
      cancelAnimationFrame(frameRef.current);
      update();
    };

    timeout = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, delay]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: displayText }} />;
}
