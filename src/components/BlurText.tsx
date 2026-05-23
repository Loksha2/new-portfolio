import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number; // delay between elements in ms
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  trigger?: boolean;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 200,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
  style,
  as = 'p',
  trigger = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [animated, setAnimated] = useState(false);

  const words = useMemo(() => (text ? text.split(' ') : []), [text]);
  const staggerDelaySec = delay / 1000;

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: direction === 'top' ? -30 : 30,
    },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 100,
        delay: i * staggerDelaySec,
      },
    }),
  };

  useEffect(() => {
    if (isInView && trigger && !animated) {
      setAnimated(true);
    }
  }, [isInView, trigger, animated]);

  useEffect(() => {
    if (animated && onAnimationComplete) {
      let totalDuration = 0;
      if (animateBy === 'words') {
        totalDuration = words.length * delay;
      } else {
        const totalChars = words.reduce((acc, word) => acc + word.length, 0);
        totalDuration = totalChars * delay;
      }
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, totalDuration + 500);
      return () => clearTimeout(timer);
    }
  }, [animated, animateBy, delay, words, onAnimationComplete]);

  // Create the dynamic motion component
  const MotionComponent = motion[as] as any;

  // Determine flex alignment based on text alignment classes in className
  const alignmentClass = className.includes('text-center')
    ? 'justify-center'
    : className.includes('text-right')
    ? 'justify-end'
    : 'justify-start';

  return (
    <MotionComponent
      ref={containerRef}
      initial="hidden"
      animate={animated ? 'visible' : 'hidden'}
      className={`flex flex-wrap ${alignmentClass} ${className}`}
      style={style}
    >
      {words.map((word, wordIdx) => {
        let wordText = word;
        let isItalicSerif = false;
        let isGradient = false;
        let suffix = '';

        const italicMatch = word.match(/^\*(.+)\*([.,\/#!$%\^&\*;:{}=\-_`~()]*)$/);
        const gradientMatch = word.match(/^\[(.+)\]([.,\/#!$%\^&\*;:{}=\-_`~()]*)$/);

        if (italicMatch) {
          isItalicSerif = true;
          wordText = italicMatch[1];
          suffix = italicMatch[2];
        } else if (gradientMatch) {
          isGradient = true;
          wordText = gradientMatch[1];
          suffix = gradientMatch[2];
        }

        if (animateBy === 'words') {
          return (
            <motion.span
              key={wordIdx}
              variants={childVariants}
              custom={wordIdx}
              className="inline-block me-[0.25em]"
            >
              <span
                className={isGradient ? "text-gradient" : ""}
                style={
                  isItalicSerif
                    ? { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, textTransform: 'none', color: 'var(--color-accent-warm)' }
                    : undefined
                }
              >
                {wordText}
              </span>
              {suffix}
            </motion.span>
          );
        } else {
          const chars = Array.from(wordText);
          return (
            <span key={wordIdx} className="inline-block me-[0.25em] whitespace-nowrap">
              <span
                className={isGradient ? "text-gradient" : ""}
                style={
                  isItalicSerif
                    ? { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, textTransform: 'none', color: 'var(--color-accent-warm)' }
                    : undefined
                }
              >
                {chars.map((char, charIdx) => {
                  let globalCharIndex = 0;
                  for (let i = 0; i < wordIdx; i++) {
                    globalCharIndex += words[i].length;
                  }
                  globalCharIndex += charIdx;

                  return (
                    <motion.span
                      key={charIdx}
                      variants={childVariants}
                      custom={globalCharIndex}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
              {suffix}
            </span>
          );
        }
      })}
    </MotionComponent>
  );
};

export default BlurText;
