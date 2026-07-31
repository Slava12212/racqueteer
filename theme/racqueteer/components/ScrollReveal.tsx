"use client";


import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction to animate from. Default: 'bottom' */
  from?: 'bottom' | 'left' | 'right' | 'top';
  /** Distance in pixels. Default: 24 */
  distance?: number;
  /** Duration in ms. Default: 700 */
  duration?: number;
  /** Scale from (0-1). If set, element scales up on reveal */
  scale?: number;
}

const getTransform = (from: string, distance: number, scale?: number) => {
  const scaleStr = scale !== undefined ? ` scale(${scale})` : '';
  switch (from) {
    case 'left': return `translateX(-${distance}px)${scaleStr}`;
    case 'right': return `translateX(${distance}px)${scaleStr}`;
    case 'top': return `translateY(-${distance}px)${scaleStr}`;
    default: return `translateY(${distance}px)${scaleStr}`;
  }
};

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
  distance = 24,
  duration = 700,
  scale,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateX(0) translateY(0)${scale !== undefined ? ' scale(1)' : ''}`
          : getTransform(from, distance, scale),
      }}
    >
      {children}
    </div>
  );
}
