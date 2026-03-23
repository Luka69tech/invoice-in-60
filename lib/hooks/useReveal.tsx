"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}) {
  const { ref, isVisible } = useReveal({ threshold, rootMargin, triggerOnce });

  const directionClasses = {
    up: "reveal",
    down: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  };

  const baseClass = directionClasses[direction];

  return (
    <div
      ref={ref as any}
      className={`${baseClass} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {children}
    </div>
  );
}

export function StaggerReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return (
    <div ref={containerRef as any} className={`stagger-children ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

export function useParallax(distance: number = 10) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const scrolled = window.scrollY;
    const elementTop = ref.current.getBoundingClientRect().top + scrolled;
    const viewportHeight = window.innerHeight;
    
    if (scrolled + viewportHeight > elementTop) {
      const scrollProgress = Math.min(
        (scrolled + viewportHeight - elementTop) / (viewportHeight + 200),
        1
      );
      setOffset((scrollProgress - 0.5) * distance);
    }
  }, [distance]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { ref, offset };
}
