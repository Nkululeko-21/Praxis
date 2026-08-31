import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll, driven off GSAP's ticker so Lenis and ScrollTrigger
 * share one clock. Without the ticker handoff the two run on separate
 * rAF loops and the scrubbed hero lags a frame behind the page.
 *
 * Disabled outright under prefers-reduced-motion: smoothing changes how
 * far a wheel notch travels, which is exactly what that setting asks us
 * not to do.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      /* Touch scrolling is left native. Smoothing it on a phone fights
         the platform's own momentum and makes the page feel heavy. */
      smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
