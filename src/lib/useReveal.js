import { useEffect, useRef } from 'react';

/**
 * Scroll-triggered reveal, §18.06: opacity plus a small position shift,
 * once, on the way in. It never reverses on the way back up — a block
 * that fades out when you scroll past it reads as a bug, not as motion.
 *
 * IntersectionObserver rather than a scroll listener, so nothing runs
 * on the main thread between reveals.
 */
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Two cases where the reveal must not gate the content: the reader
       has asked for less motion, and the browser has no
       IntersectionObserver. In the second, an unobserved block would
       stay at opacity 0 forever, which hides the page rather than
       animating it. */
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('reveal-in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
