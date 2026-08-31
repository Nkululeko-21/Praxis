import { Link } from 'react-router-dom';
import { useReveal } from '../lib/useReveal';

/* ==================================================================
   Logo — §06, §07

   A wordmark closed by two accounting rules. All dimensions derive from
   the cap height of the P, written as x in the guidelines. Instrument
   Serif's cap height is ~0.70em, so:

     rule weight       0.045x  ->  0.0315em, floored at 1px per §07
     gap between rules 0.09x   ->  0.063em  (exactly twice the weight)
     baseline to rule  0.24x   ->  0.168em

   The rules are filled blocks, not strokes, per §07. Rule and wordmark
   always share one colour (§33.03), so both inherit currentColor.
   ================================================================== */
export function Logo({ className = '', size = 22 }) {
  const x = size * 0.70;
  const weight = Math.max(1, x * 0.045);
  const gap = x * 0.09;

  return (
    <span
      className={`inline-flex flex-col ${className}`}
      style={{ fontSize: `${size}px` }}
      aria-label="Praxis"
      role="img"
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          lineHeight: 1,
          letterSpacing: '0.005em',   /* §06 — +0.5% tracking */
          paddingBottom: `${x * 0.168}px`,
        }}
        aria-hidden="true"
      >
        Praxis
      </span>
      {/* Two rules. Never one — a single rule is an unverified subtotal, §33.01 */}
      <span aria-hidden="true" style={{ height: `${weight}px`, background: 'currentColor' }} />
      <span aria-hidden="true" style={{ height: `${gap}px` }} />
      <span aria-hidden="true" style={{ height: `${weight}px`, background: 'currentColor' }} />
    </span>
  );
}

/* The favicon mark, §30 — a serif P in a charcoal square, no rules. */
export function IconMark({ size = 28, className = '' }) {
  return (
    <span
      className={`inline-grid place-items-center bg-warm text-charcoal ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.18 }}
      aria-hidden="true"
    >
      <span style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.62, lineHeight: 1 }}>P</span>
    </span>
  );
}

/* ==================================================================
   Reveal — a block that fades and lifts once, on the way in.
   ================================================================== */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ==================================================================
   Buttons — §20

   44px high, 24px horizontal padding, 3px radius, 14px sans medium,
   sentence case. No gradient, no shadow, no pill, no uppercase.

   Primary inverts on the dark ground: the guidelines specify a charcoal
   fill, which is invisible on charcoal, so the fill becomes warm white
   with charcoal type. Hover is oxblood in both directions, as specified.
   ================================================================== */
const BTN_BASE =
  'inline-flex h-11 items-center justify-center rounded-[3px] px-6 text-sm font-medium ' +
  'transition-colors duration-150 ease-[cubic-bezier(0.22,0.61,0.36,1)] whitespace-nowrap';

const VARIANTS = {
  primary: 'bg-warm text-charcoal hover:bg-oxblood hover:text-warm',
  secondary: 'border border-[color:var(--hair-strong)] text-warm hover:bg-panel-2 hover:border-warm/40',
  onLight: 'bg-charcoal text-warm hover:bg-oxblood',
  onLightSecondary:
    'border border-[color:var(--hair-on-light)] text-charcoal hover:bg-bone hover:border-charcoal/40',
};

function buttonClass(variant, className) {
  return `${BTN_BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`;
}

export function ButtonLink({ to, href, variant = 'primary', className = '', children, ...rest }) {
  if (to) {
    return (
      <Link to={to} className={buttonClass(variant, className)} {...rest}>
        {children}
      </Link>
    );
  }
  const external = href?.startsWith('http');
  return (
    <a
      href={href}
      className={buttonClass(variant, className)}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <button type="button" className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  );
}

/* Text button, §20 — underline at 3px offset, oxblood on hover.
   Ember rather than oxblood on the dark ground; see DEVIATIONS.md. */
export function TextLink({ to, href, className = '', children, ...rest }) {
  const cls =
    'underline underline-offset-[3px] decoration-[color:var(--hair-strong)] ' +
    `transition-colors duration-150 hover:text-ember hover:decoration-ember ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return (
    <a href={href} className={cls} target="_blank" rel="noreferrer noopener" {...rest}>
      {children}
    </a>
  );
}

/* ==================================================================
   Section heading — §18.01

   Every major section opens with a two-digit index in slate, set in the
   serif above the heading. The numbering is continuous down each page
   and reflects real sequence, so the index is always passed in, never
   generated from the DOM.
   ================================================================== */
export function SectionHead({ index, eyebrow, title, lede, className = '' }) {
  return (
    <header className={className}>
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span
            className="text-quiet"
            style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
            aria-hidden="true"
          >
            {index}
          </span>
          {eyebrow && <span className="t-label text-quiet">{eyebrow}</span>}
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="t-h1 measure-display mt-5 text-warm">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={110}>
          <p className="t-body-lg measure mt-6 text-quiet">{lede}</p>
        </Reveal>
      )}
    </header>
  );
}

/* ==================================================================
   Line item — §18.03, §21

   Services and case studies are ruled rows in the manner of a statement:
   an index, a title, a one-line description, and a figure. Rows are
   separated by hairlines, never by gaps and shadows.
   ================================================================== */
export function LineItem({ index, title, description, figure, to, href }) {
  const body = (
    <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-7 lg:py-8">
      <span className="col-span-2 t-caption text-quiet sm:col-span-1" aria-hidden="true">
        {index}
      </span>
      <h3 className="col-span-10 t-h3 text-warm sm:col-span-4 lg:col-span-3">{title}</h3>
      <p className="col-span-12 t-small text-quiet sm:col-span-7 sm:col-start-6 lg:col-span-6">
        {description}
      </p>
      {figure && (
        <span className="col-span-12 t-caption text-quiet sm:col-span-12 lg:col-span-2 lg:text-right">
          {figure}
        </span>
      )}
    </div>
  );

  const cls =
    'group block hairline transition-colors duration-150 hover:bg-panel/70 ' +
    '-mx-4 px-4 first:border-t-0';

  if (to) return <Reveal><Link to={to} className={cls}>{body}</Link></Reveal>;
  if (href) return <Reveal><a href={href} className={cls}>{body}</a></Reveal>;
  return <Reveal><div className={`${cls} hover:bg-transparent`}>{body}</div></Reveal>;
}

/* A figure set large in the serif, §32 — used for proof and results. */
export function Figure({ value, label, note }) {
  return (
    <div>
      <div className="t-h1 text-warm" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
      <div className="t-label mt-3 text-quiet">{label}</div>
      {note && <p className="t-small mt-2 text-quiet">{note}</p>}
    </div>
  );
}
