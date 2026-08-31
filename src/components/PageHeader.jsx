import { Reveal } from './ui';

/**
 * The opening block on an inner page. It clears the fixed header and
 * gives the display line the air §18.04 asks for, without a hero image —
 * the scroll sequence belongs to the home page only, and repeating it on
 * every page would make it decoration rather than an introduction.
 */
export default function PageHeader({ eyebrow, title, lede, children }) {
  return (
    <section>
      <div className="shell pb-16 pt-[136px] lg:pb-24 lg:pt-[184px]">
        <Reveal>
          <p className="t-label text-quiet">{eyebrow}</p>
        </Reveal>
        <Reveal delay={70}>
          <h1 className="t-display measure-display mt-6 text-warm">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={130}>
            <p className="t-body-lg measure mt-8 text-quiet">{lede}</p>
          </Reveal>
        )}
        {children && <Reveal delay={190}>{children}</Reveal>}
      </div>
    </section>
  );
}
