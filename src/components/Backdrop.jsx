/* ==================================================================
   Section backdrops.

   The brief asks for abstract background visuals — dataflow, node graphs,
   dashboards — dark-dominant and never above 20% opacity behind copy.
   §17 says Praxis does not use illustration, and that a concept needing
   visual explanation is drawn as a diagram: hairline rules, no colour
   beyond the palette, no perspective. These are the two constraints
   satisfied at once — every backdrop here is a diagram of something the
   business actually does, drawn in hairlines.

   Two rules govern placement, and they are what keep this from becoming
   decoration:

   1. A backdrop occupies the empty columns, not the text. §14 says body
      copy sits in columns 1-7 and that the remaining columns are a
      deliberate part of the layout; these live there. Nothing is ever
      placed behind a paragraph and then dimmed until it is tolerable.

   2. Opacity is capped at 0.16, below the 20% the brief allows, and the
      figures are hairlines to begin with.

   Generated once at module load from a fixed seed, so the geometry is
   identical on every render and every reload — a background that reshuffles
   when React re-renders is a distraction, not a texture.
   ================================================================== */

/* mulberry32 — same generator as the hero renderer, for the same reason:
   the layout must be reproducible, not merely random-looking. */
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const HAIR = 'rgba(250,248,244,0.55)';
const INK = 'rgba(250,248,244,0.85)';

/* ---- a node graph: what a workflow looks like from above ---------- */
const NODES = (() => {
  const r = rng(4417);
  const cols = 5, rows = 6;
  const pts = [];
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      if (r() < 0.34) continue;                 // a sparse graph, not a lattice
      pts.push({
        id: `${c}-${row}`,
        c,
        x: 30 + c * 62 + (r() - 0.5) * 18,
        y: 24 + row * 58 + (r() - 0.5) * 20,
        filled: r() < 0.28,
        s: r() < 0.28 ? 5 : 3.5,
      });
    }
  }
  // connect each node forward to one or two in the next column
  const edges = [];
  for (const p of pts) {
    const next = pts.filter((q) => q.c === p.c + 1);
    if (!next.length) continue;
    const count = r() < 0.45 ? 2 : 1;
    for (let i = 0; i < count && i < next.length; i++) {
      const q = next[Math.floor(r() * next.length)];
      if (q) edges.push({ a: p, b: q, k: `${p.id}>${q.id}-${i}` });
    }
  }
  return { pts, edges };
})();

function NodeGraph() {
  return (
    <svg viewBox="0 0 340 380" fill="none" preserveAspectRatio="xMidYMid meet">
      {NODES.edges.map((e) => (
        <line key={e.k} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke={HAIR} strokeWidth="1" />
      ))}
      {NODES.pts.map((p) => (
        <rect
          key={p.id}
          x={p.x - p.s / 2}
          y={p.y - p.s / 2}
          width={p.s}
          height={p.s}
          fill={p.filled ? INK : 'none'}
          stroke={p.filled ? 'none' : HAIR}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

/* ---- a statement: ruled rows closed by a double rule -------------- */
const LEDGER = (() => {
  const r = rng(90211);
  return Array.from({ length: 15 }, () => ({
    label: 60 + r() * 130,
    figure: 26 + r() * 44,
  }));
})();

function Ledger() {
  const dy = 22;
  const W = 300;
  const end = LEDGER.length * dy;
  return (
    <svg viewBox={`0 0 ${W} ${end + 34}`} fill="none" preserveAspectRatio="xMidYMid meet">
      {LEDGER.map((row, i) => {
        const y = i * dy;
        return (
          <g key={i}>
            <line x1="0" y1={y + 14} x2={W} y2={y + 14} stroke="rgba(250,248,244,0.32)" strokeWidth="1" />
            <rect x="0" y={y + 5} width={row.label} height="2" fill="rgba(250,248,244,0.5)" />
            <rect x={W - row.figure} y={y + 4} width={row.figure} height="3" fill={INK} />
          </g>
        );
      })}
      {/* the total, closed the way the mark closes — §07, §32 */}
      <rect x={W - 86} y={end + 8} width="86" height="4" fill={INK} />
      <rect x="0" y={end + 22} width={W} height="1.6" fill={INK} />
      <rect x="0" y={end + 27} width={W} height="1.6" fill={INK} />
    </svg>
  );
}

/* ---- dataflow: lanes converging into one ------------------------- */
const FLOW = (() => {
  const r = rng(31337);
  return Array.from({ length: 7 }, (_, i) => ({
    y: 20 + i * 34,
    ticks: Array.from({ length: 4 + Math.floor(r() * 5) }, () => 20 + r() * 250),
  }));
})();

function Flow() {
  const W = 320, MID = 128;
  return (
    <svg viewBox="0 0 340 260" fill="none" preserveAspectRatio="xMidYMid meet">
      {FLOW.map((lane, i) => (
        <g key={i}>
          {/* each lane runs flat, then bends once into the shared spine */}
          <path
            d={`M0 ${lane.y} H${W - 130} C${W - 96} ${lane.y}, ${W - 96} ${MID}, ${W - 62} ${MID}`}
            stroke={HAIR}
            strokeWidth="1"
          />
          {lane.ticks.map((t, j) => (
            <rect key={j} x={t} y={lane.y - 1.75} width="3.5" height="3.5" fill={INK} />
          ))}
        </g>
      ))}
      <line x1={W - 62} y1={MID} x2={W} y2={MID} stroke={INK} strokeWidth="1" />
      <rect x={W - 8} y={MID - 4} width="8" height="8" stroke={INK} strokeWidth="1" fill="none" />
    </svg>
  );
}

/* ---- a dashboard: stacked bars and a plotted line ----------------- */
const DASH = (() => {
  const r = rng(778102);
  const bars = Array.from({ length: 18 }, () => 12 + r() * 74);
  const line = Array.from({ length: 18 }, (_, i) => ({ x: i * 17 + 8, y: 30 + r() * 46 }));
  return { bars, line };
})();

function Dashboard() {
  const base = 150;
  return (
    <svg viewBox="0 0 320 200" fill="none" preserveAspectRatio="xMidYMid meet">
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" y1={30 + i * 40} x2="320" y2={30 + i * 40} stroke="rgba(250,248,244,0.26)" strokeWidth="1" />
      ))}
      {DASH.bars.map((h, i) => (
        <rect key={i} x={i * 17 + 4} y={base - h} width="8" height={h} fill="rgba(250,248,244,0.42)" />
      ))}
      <polyline
        points={DASH.line.map((p) => `${p.x},${p.y}`).join(' ')}
        stroke={INK}
        strokeWidth="1.25"
        fill="none"
      />
      <line x1="0" y1={base} x2="320" y2={base} stroke={INK} strokeWidth="1" />
    </svg>
  );
}

const SHAPES = {
  nodes: NodeGraph,
  ledger: Ledger,
  flow: Flow,
  dashboard: Dashboard,
};

/**
 * A backdrop pinned into a section's empty columns.
 *
 * @param {'nodes'|'ledger'|'flow'|'dashboard'} shape
 * @param {number} opacity  capped at 0.16 — see the note at the top
 * @param {string} className  positioning; defaults to the right-hand columns
 */
export default function Backdrop({
  shape = 'nodes',
  opacity = 0.13,
  className = '',
}) {
  const Shape = SHAPES[shape] ?? NodeGraph;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ opacity: Math.min(opacity, 0.16) }}
    >
      <Shape />
    </div>
  );
}
