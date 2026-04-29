import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export function Typewriter({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = ''
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        timeout = setTimeout(() => {}, 500); // small pause before typing next
      } else {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentPhrase) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      } else {
        timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[2px] h-[1em] bg-mint ml-1 align-middle"
      />
    </span>
  );
}
