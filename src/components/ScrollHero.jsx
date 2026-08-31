import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import manifest from '../hero-frames.json';
import { ButtonLink, Reveal } from './ui';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Scroll-driven hero.

   The technique is the one from the video-to-website skill: a video is
   decomposed into a WebP frame sequence, the sequence is drawn to a
   canvas, and scroll position — not time — selects the frame. Scroll
   drives the clock, so the sequence scrubs both ways and never plays on
   its own.

   Two departures from the skill's default build, both deliberate:

   1. The canvas is scoped to the hero. The skill pins one canvas behind
      the whole document; the brief asks for scroll-triggered reveals
      below the fold instead, and a page-length canvas would also keep a
      decoded frame buffer alive for the entire session on a phone.

   2. The frames sit behind the copy at low opacity with a scrim over
      the text column. The sequence is a background, not the subject.
------------------------------------------------------------------- */

const FRAME_COUNT = manifest.count;
const framePath = (i) => `/hero-frames/frame_${String(i + 1).padStart(4, '0')}.webp`;

/* Frames rendered eagerly before the hero is considered ready. The rest
   stream in behind them, so the first paint does not wait on 150 files. */
const EAGER = 12;

export default function ScrollHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const framesRef = useRef([]);
  const currentRef = useRef(-1);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ---- load the sequence ---------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    const images = new Array(FRAME_COUNT);
    framesRef.current = images;

    const load = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { images[i] = img; resolve(); };
        img.onerror = resolve;          // a dropped frame must not stall the hero
        img.src = framePath(i);
      });

    (async () => {
      await Promise.all(Array.from({ length: EAGER }, (_, i) => load(i)));
      if (cancelled) return;
      setReady(true);

      let done = EAGER;
      for (let i = EAGER; i < FRAME_COUNT; i++) {
        if (cancelled) return;
        await load(i);
        done += 1;
        setProgress(done / FRAME_COUNT);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  /* ---- draw + bind to scroll ------------------------------------ */
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    /* Cover fit. The frames carry their own vignette and margin, so a
       true cover crop is right here — there is no product to clip. */
    function draw(index) {
      const img = framesRef.current[index];
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      ctx.fillStyle = '#14161A';
      ctx.fillRect(0, 0, cw, ch);
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    /* Nearest already-loaded frame, so scrubbing ahead of the background
       loader shows the closest real frame instead of a blank canvas. */
    function nearestLoaded(index) {
      const frames = framesRef.current;
      if (frames[index]) return index;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (frames[index - d]) return index - d;
        if (frames[index + d]) return index + d;
      }
      return -1;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const i = currentRef.current < 0 ? 0 : currentRef.current;
      const n = nearestLoaded(i);
      if (n >= 0) draw(n);
    }

    resize();
    window.addEventListener('resize', resize);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let trigger;
    if (reduced) {
      /* §18.06 — if the reader has asked for less motion, the hero is a
         still. The last frame is the resolved state, which is the point. */
      const n = nearestLoaded(FRAME_COUNT - 1);
      if (n >= 0) { currentRef.current = n; draw(n); }
    } else {
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          /* The sequence resolves by ~85% of the hero's scroll range, so
             the closing ledger is on screen while the copy is still
             readable rather than arriving as the hero leaves. */
          const p = Math.min(self.progress / 0.85, 1);
          const index = Math.min(Math.floor(p * FRAME_COUNT), FRAME_COUNT - 1);
          if (index === currentRef.current) return;
          currentRef.current = index;
          const n = nearestLoaded(index);
          if (n >= 0) requestAnimationFrame(() => draw(n));
        },
      });

      /* The copy releases as the sequence resolves — opacity and a small
         lift, nothing else. */
      gsap.to(copyRef.current, {
        opacity: 0,
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '55% top',
          scrub: true,
        },
      });
    }

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', resize);
      trigger?.kill();
      ScrollTrigger.getAll().forEach((t) => { if (t.trigger === section) t.kill(); });
    };
  }, [ready]);

  return (
    <section ref={sectionRef} className="relative h-[240vh] lg:h-[280vh]" aria-label="Introduction">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-70 transition-opacity duration-700"
          style={{ opacity: ready ? undefined : 0 }}
          aria-hidden="true"
        />

        {/* Scrim. The brief caps the background at 20% behind copy, so it
            is damped hardest where the copy sits and left legible where it
            does not.

            The two directions matter. On a wide screen the copy holds the
            left half, so the gradient runs across. On a phone the copy
            holds the top and the cover crop pushes the frame's centre
            straight under it, so the gradient runs down instead — one
            horizontal scrim would leave particles reading through the
            headline. */}
        <div
          className="absolute inset-0 lg:hidden"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20,22,26,0.95) 0%, rgba(20,22,26,0.94) 55%, rgba(20,22,26,0.72) 78%, rgba(20,22,26,0.35) 100%)',
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(100deg, rgba(20,22,26,0.95) 0%, rgba(20,22,26,0.90) 38%, rgba(20,22,26,0.40) 60%, rgba(20,22,26,0.30) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          aria-hidden="true"
          style={{ background: 'linear-gradient(to bottom, transparent, #14161A)' }}
        />

        {/* the copy */}
        <div className="shell relative flex h-full items-center">
          <div ref={copyRef} className="max-w-[38rem] pb-16">
            <Reveal>
              <p className="t-label text-quiet">Praxis · Automation studio · Eswatini</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="t-display mt-7 text-warm">
                The work that repeats
                <br />
                should not be done
                <br />
                by a person.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="t-body-lg measure mt-8 text-quiet">
                We build the systems that move your leads, your invoices and your
                reporting without anyone retyping them. Scope, timeline and cost are
                stated before the work starts.
              </p>
            </Reveal>
            <Reveal delay={230}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink to="/audit">Get an audit</ButtonLink>
                <ButtonLink to="/how-it-works" variant="secondary">
                  See how it works
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <p className="t-caption mt-6 text-quiet">
                16 questions, about 4 minutes. No account, no email required.
              </p>
            </Reveal>
          </div>
        </div>

        {/* loading state — a rule that fills, not a spinner */}
        {!ready && (
          <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hair)]" aria-hidden="true">
            <div className="h-px w-1/3 bg-warm/50" />
          </div>
        )}
        {ready && progress < 1 && (
          <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hair)]" aria-hidden="true">
            <div
              className="h-px bg-warm/30 transition-[width] duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}

        {/* scroll indicator */}
        <div className="shell pointer-events-none absolute inset-x-0 bottom-8">
          <div className="flex items-center gap-3 text-quiet">
            <span className="t-label">Scroll</span>
            <span className="h-px w-16 bg-[color:var(--hair-strong)]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
