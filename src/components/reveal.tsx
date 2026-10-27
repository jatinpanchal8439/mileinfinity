import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  direction?: "up" | "down" | "left" | "right" | "none" | "scale";
  distance?: number; // in pixels
  threshold?: number;
  once?: boolean;
}

/**
 * High-performance GSAP Scroll Reveal Component
 * Seamlessly transitions any UI block into view with GreenSock hardware acceleration
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 800,
  direction = "up",
  distance = 32,
  threshold = 0.1,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    let initialVars: gsap.TweenVars = { opacity: 0 };
    if (direction === "up") initialVars.y = distance;
    else if (direction === "down") initialVars.y = -distance;
    else if (direction === "left") initialVars.x = distance;
    else if (direction === "right") initialVars.x = -distance;
    else if (direction === "scale") initialVars.scale = 0.92;

    // Set initial position
    gsap.set(el, initialVars);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: duration / 1000,
            delay: delay / 1000,
            ease: "power3.out",
            overwrite: "auto",
          });
          if (once) observer.unobserve(el);
        } else if (!once) {
          gsap.to(el, {
            opacity: 0,
            ...initialVars,
            duration: 0.4,
            ease: "power2.in",
            overwrite: "auto",
          });
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(el);
    };
  }, [direction, distance, duration, delay, threshold, once]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
