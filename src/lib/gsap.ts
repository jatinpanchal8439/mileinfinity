import gsap from "gsap";

/**
 * Universal SSR-safe GSAP Animation Suite
 * Powered by GreenSock for high-performance 60fps micro-interactions
 */

export const isClient = typeof window !== "undefined";

/**
 * Animate elements into view with stagger and elegant easing
 */
export function animateFadeIn(
  target: gsap.TweenTarget,
  options?: {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
    onComplete?: () => void;
  }
) {
  if (!isClient || !target) return;
  const {
    y = 24,
    x = 0,
    duration = 0.65,
    delay = 0,
    stagger = 0.08,
    ease = "power3.out",
    onComplete,
  } = options || {};

  const toVars: gsap.TweenVars = { opacity: 1, y: 0, x: 0, duration, delay, stagger, ease };
  if (onComplete) toVars.onComplete = onComplete;
  return gsap.fromTo(
    target,
    { opacity: 0, y, x },
    toVars
  );
}

/**
 * Scale pop-in entrance for modals, cards, badges
 */
export function animateScaleIn(
  target: gsap.TweenTarget,
  options?: {
    scale?: number;
    duration?: number;
    delay?: number;
    ease?: string;
  }
) {
  if (!isClient || !target) return;
  const { scale = 0.9, duration = 0.45, delay = 0, ease = "back.out(1.5)" } = options || {};

  return gsap.fromTo(
    target,
    { opacity: 0, scale },
    { opacity: 1, scale: 1, duration, delay, ease }
  );
}

/**
 * Slide drawer in from right or left
 */
export function animateSlideIn(
  target: gsap.TweenTarget,
  direction: "right" | "left" | "bottom" = "right",
  duration = 0.45
) {
  if (!isClient || !target) return;
  const vars: gsap.TweenVars = { duration, ease: "power3.out" };

  if (direction === "right") {
    return gsap.fromTo(target, { xPercent: 100 }, { ...vars, xPercent: 0 });
  } else if (direction === "left") {
    return gsap.fromTo(target, { xPercent: -100 }, { ...vars, xPercent: 0 });
  } else {
    return gsap.fromTo(target, { yPercent: 100 }, { ...vars, yPercent: 0 });
  }
}

/**
 * Floating botanical animation (subtle continuous floating effect)
 */
export function animateFloat(
  target: gsap.TweenTarget,
  options?: {
    y?: number;
    duration?: number;
    rotation?: number;
  }
) {
  if (!isClient || !target) return;
  const { y = -10, duration = 2.5, rotation = 1.5 } = options || {};

  return gsap.to(target, {
    y,
    rotation,
    duration,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/**
 * Number Counter animation (e.g. ₹0 to ₹34,900)
 */
export function animateNumberCounter(
  target: { value: number },
  endValue: number,
  onUpdate: (latest: number) => void,
  duration = 1.2
) {
  if (!isClient) {
    onUpdate(endValue);
    return;
  }

  return gsap.to(target, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      onUpdate(Math.round(target.value));
    },
  });
}

/**
 * Card hover spring physics
 */
export function bindHoverSpring(element: HTMLElement | null) {
  if (!isClient || !element) return () => {};

  const onEnter = () => {
    gsap.to(element, { y: -6, scale: 1.015, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(element, { y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
  };

  element.addEventListener("mouseenter", onEnter);
  element.addEventListener("mouseleave", onLeave);

  return () => {
    element.removeEventListener("mouseenter", onEnter);
    element.removeEventListener("mouseleave", onLeave);
  };
}

export { gsap };
