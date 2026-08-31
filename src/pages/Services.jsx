import CTABand from '../components/CTABand';
import { Reveal, ButtonLink } from '../components/ui';
import { SERVICES } from '../lib/services';
import { whatsappLink, MESSAGES } from '../lib/contact';
import PageHeader from '../components/PageHeader';

/* Before and after, as two ruled columns. The difference is carried by
   type colour and by the rule, not by red and green — §12 rules out
   using the accent as a default device, and a status colour on twelve
   lines would be exactly that. */
function BeforeAfter({ before, after }) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <h4 className="t-label pb-4 text-quiet">{before.label} · done by a person</h4>
        <ol className="border-t border-[color:var(--hair)]">
          {before.lines.map((line, i) => (
            <li key={i} className="flex gap-4 border-b border-[color:var(--hair)] py-4">
              <span className="t-caption shrink-0 text-quiet/70" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t-small text-quiet">{line}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h4 className="t-label pb-4 text-warm">{after.label} · done by the system</h4>
        <ol className="border-t border-[color:var(--hair-strong)]">
          {after.lines.map((line, i) => (
            <li key={i} className="flex gap-4 border-b border-[color:var(--hair-strong)] py-4">
              <span className="t-caption shrink-0 text-quiet" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t-small text-warm">{line}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Three pillars, and the workflows built on top of them."
        lede="Each of these removes a specific, countable task from somebody's week. Scope, timeline and cost are stated before the work begins and revised in writing if they change."
      />

      {SERVICES.map((service) => (
        <section key={service.slug} id={service.slug} className="hairline scroll-mt-24">
          <div className="shell section-pad">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-quiet"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                      aria-hidden="true"
                    >
                      {service.index}
                    </span>
                    <span className="t-label text-quiet">
                      {service.pillar ? 'Pillar' : 'Built on the pillars'}
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={60}>
                  <h2 className="t-h1 measure-display mt-5 text-warm">{service.title}</h2>
                </Reveal>
                <Reveal delay={110}>
                  <p className="t-body-lg measure mt-6 text-quiet">{service.summary}</p>
                </Reveal>
              </div>

              <div className="lg:col-span-4 lg:col-start-9">
                <Reveal delay={140}>
                  <dl className="border-t border-[color:var(--hair)]">
                    <div className="flex justify-between gap-6 border-b border-[color:var(--hair)] py-4">
                      <dt className="t-caption text-quiet">Typical timeline</dt>
                      <dd className="t-small text-warm">{service.typical}</dd>
                    </div>
                    <div className="flex justify-between gap-6 border-b border-[color:var(--hair)] py-4">
                      <dt className="t-caption text-quiet">Engagement</dt>
                      <dd className="t-small text-warm">{service.lead}</dd>
                    </div>
                  </dl>
                </Reveal>
              </div>
            </div>

            <div className="mt-16 lg:mt-20">
              <Reveal>
                <BeforeAfter before={service.before} after={service.after} />
              </Reveal>
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <Reveal>
                  <h3 className="t-label text-quiet">What this does not do</h3>
                  <p className="t-body measure mt-4 text-warm">{service.limit}</p>
                </Reveal>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                <Reveal delay={60}>
                  <h3 className="t-label text-quiet">Built on</h3>
                  <ul className="mt-4 border-t border-[color:var(--hair)]">
                    {service.builtOn.map((b) => (
                      <li key={b} className="border-b border-[color:var(--hair)] py-3 t-small text-quiet">
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>

            <Reveal>
              <div className="mt-12 flex flex-wrap gap-4">
                <ButtonLink to="/audit">Get an audit</ButtonLink>
                <ButtonLink
                  href={whatsappLink(MESSAGES.services(service.title.toLowerCase()))}
                  variant="secondary"
                >
                  Ask about {service.title.toLowerCase()}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <CTABand
        index="05"
        title="Not sure which of these you need?"
        body="That is what the audit is for. Sixteen questions about how the work actually gets done, and a ranked answer at the end — including the case where the answer is that you do not need us yet."
      />
    </>
  );
}
