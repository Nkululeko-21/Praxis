import { useEffect, useRef, useState } from 'react';
import { STAGES } from '../lib/pipeline';

/* ------------------------------------------------------------------
   The six-stage workflow, drawn.

   §17 rules out illustration and asks for a diagram: hairlines, charcoal
   type, no perspective, no colour beyond the palette. That is what this
   is — a ruled line with six stations on it.

   The motion is functional. Stages light in sequence because the
   sequence is the content, and a packet travels the line because the
   diagram is describing something that moves. Under reduced-motion the
   whole thing renders in its resolved state with nothing travelling.
------------------------------------------------------------------- */

function useInView(options = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

export default function PipelineDiagram({ detailed = false }) {
  const [ref, inView] = useInView();
  const [lit, setLit] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setLit(STAGES.length); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLit(i);
      if (i >= STAGES.length) clearInterval(id);
    }, 190);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const complete = lit >= STAGES.length;

  return (
    <div ref={ref} className="w-full">
      {/* ---------- desktop: a horizontal rule with six stations ------- */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* the spine */}
          <div className="absolute left-0 right-0 top-[46px] h-px bg-[color:var(--hair)]" aria-hidden="true" />
          <div
            className="absolute left-0 top-[46px] h-px bg-warm/45 transition-[width] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{ width: `${(lit / STAGES.length) * 100}%` }}
            aria-hidden="true"
          />
          {/* the packet, once the line is drawn */}
          {complete && !reduced && (
            <span className="pipeline-packet absolute top-[44px] h-[5px] w-[5px] bg-warm" aria-hidden="true" />
          )}

          <ol className="relative grid grid-cols-6 gap-6">
            {STAGES.map((stage, i) => {
              const on = i < lit;
              return (
                <li key={stage.name} className="pr-4">
                  <span
                    className="t-caption block transition-colors duration-300"
                    style={{ color: on ? 'var(--color-quiet)' : 'rgba(138,146,153,0.35)' }}
                  >
                    {stage.index}
                  </span>
                  {/* the station */}
                  <span
                    className="mt-3 grid h-[26px] w-[26px] place-items-center border transition-all duration-300"
                    style={{
                      borderColor: on ? 'rgba(250,248,244,0.5)' : 'var(--hair)',
                      backgroundColor: 'var(--color-charcoal)',
                    }}
                    aria-hidden="true"
                  >
                    <span
                      className="block transition-all duration-300"
                      style={{
                        width: on ? 8 : 4,
                        height: on ? 8 : 4,
                        backgroundColor: on ? 'var(--color-warm)' : 'var(--hair-strong)',
                      }}
                    />
                  </span>
                  <h3
                    className="t-h3 mt-5 transition-colors duration-300"
                    style={{ color: on ? 'var(--color-warm)' : 'var(--color-quiet)' }}
                  >
                    {stage.name}
                  </h3>
                  <p
                    className="t-small mt-2 transition-opacity duration-500"
                    style={{ color: 'var(--color-quiet)', opacity: on ? 1 : 0.4 }}
                  >
                    {stage.short}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ---------- mobile: the same sequence, turned vertical --------- */}
      <ol className="lg:hidden">
        {STAGES.map((stage, i) => {
          const on = i < lit;
          return (
            <li key={stage.name} className="relative pb-8 pl-10 last:pb-0">
              {i < STAGES.length - 1 && (
                <span
                  className="absolute left-[12px] top-6 bottom-0 w-px transition-colors duration-500"
                  style={{ background: on ? 'rgba(250,248,244,0.35)' : 'var(--hair)' }}
                  aria-hidden="true"
                />
              )}
              <span
                className="absolute left-0 top-1 grid h-[25px] w-[25px] place-items-center border transition-all duration-300"
                style={{ borderColor: on ? 'rgba(250,248,244,0.5)' : 'var(--hair)' }}
                aria-hidden="true"
              >
                <span
                  className="block transition-all duration-300"
                  style={{
                    width: on ? 7 : 4,
                    height: on ? 7 : 4,
                    backgroundColor: on ? 'var(--color-warm)' : 'var(--hair-strong)',
                  }}
                />
              </span>
              <div className="flex items-baseline gap-3">
                <span className="t-caption text-quiet">{stage.index}</span>
                <h3 className="t-h3" style={{ color: on ? 'var(--color-warm)' : 'var(--color-quiet)' }}>
                  {stage.name}
                </h3>
              </div>
              <p className="t-small mt-1 text-quiet">{stage.short}</p>
              {detailed && <p className="t-small mt-3 text-quiet">{stage.detail}</p>}
            </li>
          );
        })}
      </ol>

      <style>{`
        @keyframes praxis-packet {
          0%   { left: 0%;   opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .pipeline-packet {
          animation: praxis-packet 3.6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pipeline-packet { display: none; }
        }
      `}</style>
    </div>
  );
}
