import PageHeader from '../components/PageHeader';
import { Reveal, ButtonLink, Logo } from '../components/ui';
import {
  EMAIL, WHATSAPP_DISPLAY, LOCATION, whatsappLink, mailtoLink, MESSAGES,
} from '../lib/contact';

/* §05 — the five values, as written in the brand document. */
const VALUES = [
  {
    index: '01',
    name: 'Precision',
    body: 'We prefer a specific number to a confident adjective. Scope, timeline and cost are stated plainly before work begins, and revised in writing when they change.',
  },
  {
    index: '02',
    name: 'Transparency',
    body: 'The method is visible. Clients see how a system works, not only that it works — including its limits.',
  },
  {
    index: '03',
    name: 'Restraint',
    body: 'We build the smallest thing that solves the problem. Features are subtractions from simplicity and must earn their place.',
  },
  {
    index: '04',
    name: 'Rigour',
    body: 'Work is checked before it is delivered. A closed total means it has been verified, not merely finished.',
  },
  {
    index: '05',
    name: 'Durability',
    body: 'We build for the version of the business that exists in five years, not for the demo.',
  },
];

const COMMITMENTS = [
  'You own the accounts, the credentials and the workflow definitions. There is no mechanism that makes leaving expensive.',
  'We write into the tools you already pay for wherever we can. Replacing a working system is a separate decision from automating it.',
  'If a rule will do the job, we write the rule rather than putting a model in front of it.',
  'Where we think automation is not yet the right spend, we say so — including at the end of the audit.',
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Praxis is named for theory made practical."
        lede="Knowledge that only counts once it has been enacted. The studio exists to express one belief: that good work is shown, not claimed."
      />

      {/* ---- 01 philosophy ------------------------------------------ */}
      <section className="hairline">
        <div className="shell section-pad">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-quiet"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    01
                  </span>
                  <span className="t-label text-quiet">Philosophy</span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-5">
              <Reveal>
                <h2 className="t-h1 text-warm">Precision through simplicity.</h2>
              </Reveal>
              <Reveal delay={70}>
                <p className="t-body-lg measure mt-8 text-quiet">
                  The identity borrows its logic from bookkeeping — a discipline where
                  nothing is asserted without a corresponding entry, and where the
                  presentation of information is itself a form of honesty. Figures are
                  itemised. Totals are ruled and closed. Nothing is decorated to seem
                  more than it is.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="t-body measure mt-6 text-quiet">
                  Applied to automation, that means the work is described in plain
                  terms, scope is stated before it is sold, and the interface never
                  flatters itself. Restraint is not an aesthetic preference here. It is
                  the argument.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 02 mission and vision ---------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-quiet"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    02
                  </span>
                  <span className="t-label text-quiet">Position</span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal>
                <h3 className="t-label text-quiet">Mission</h3>
                <p className="t-h2 measure-display mt-4 text-warm">
                  To build digital systems that make a business's operations legible,
                  reliable and worth trusting, delivered with the rigour of a well-kept
                  set of books.
                </p>
              </Reveal>
              <Reveal delay={90}>
                <h3 className="t-label mt-16 text-quiet">Vision</h3>
                <p className="t-h2 measure-display mt-4 text-warm">
                  A standard in which any business, at any size, can run on systems as
                  disciplined as its accounts — where clarity is the default rather than
                  a premium feature.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 03 values ---------------------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span
                className="text-quiet"
                style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                aria-hidden="true"
              >
                03
              </span>
              <span className="t-label text-quiet">Values</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-h1 measure-display mt-5 text-warm">
              Five commitments that govern how work is scoped, built and described.
            </h2>
          </Reveal>

          <div className="mt-14 lg:mt-16">
            {VALUES.map((v) => (
              <Reveal key={v.index}>
                <div className="hairline grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-7">
                  <span className="col-span-2 t-caption text-quiet sm:col-span-1">{v.index}</span>
                  <h3 className="col-span-10 t-h3 text-warm sm:col-span-3">{v.name}</h3>
                  <p className="col-span-12 t-small text-quiet sm:col-span-7 sm:col-start-5">{v.body}</p>
                </div>
              </Reveal>
            ))}
            <div className="hairline" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ---- 04 what we commit to ----------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-quiet"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    04
                  </span>
                  <span className="t-label text-quiet">In practice</span>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="t-h1 mt-5 text-warm">Four things we will hold to.</h2>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <ul className="border-t border-[color:var(--hair)]">
                {COMMITMENTS.map((c, i) => (
                  <Reveal as="li" key={i} delay={i * 50} className="border-b border-[color:var(--hair)] py-5">
                    <span className="t-body text-warm">{c}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 05 contact --------------------------------------------- */}
      <section id="contact" className="hairline scroll-mt-24">
        <div className="shell section-pad">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-quiet"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    05
                  </span>
                  <span className="t-label text-quiet">Contact</span>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="t-h1 mt-5 text-warm">Start with a message, or start with the audit.</h2>
              </Reveal>
              <Reveal delay={110}>
                <p className="t-body-lg measure mt-6 text-quiet">
                  WhatsApp is the fastest way to reach us and the one we watch. If you
                  would rather have something to react to, do the audit first and send
                  us the result — it makes the first conversation much shorter.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <ButtonLink to="/audit">Get an audit</ButtonLink>
                  <ButtonLink href={whatsappLink(MESSAGES.general)} variant="secondary">
                    Message us on WhatsApp
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal delay={120}>
                <dl className="border-t border-[color:var(--hair)]">
                  <div className="border-b border-[color:var(--hair)] py-5">
                    <dt className="t-label text-quiet">WhatsApp</dt>
                    <dd className="t-h3 mt-2">
                      <a
                        href={whatsappLink(MESSAGES.general)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-warm underline underline-offset-[3px] decoration-[color:var(--hair-strong)] hover:text-ember hover:decoration-ember"
                      >
                        {WHATSAPP_DISPLAY}
                      </a>
                    </dd>
                  </div>
                  <div className="border-b border-[color:var(--hair)] py-5">
                    <dt className="t-label text-quiet">Email</dt>
                    <dd className="t-body mt-2">
                      <a
                        href={mailtoLink('Automation enquiry')}
                        className="break-all text-warm underline underline-offset-[3px] decoration-[color:var(--hair-strong)] hover:text-ember hover:decoration-ember"
                      >
                        {EMAIL}
                      </a>
                    </dd>
                  </div>
                  <div className="border-b border-[color:var(--hair)] py-5">
                    <dt className="t-label text-quiet">Based in</dt>
                    <dd className="t-body mt-2 text-warm">{LOCATION}</dd>
                  </div>
                  <div className="border-b border-[color:var(--hair)] py-5">
                    <dt className="t-label text-quiet">Working hours</dt>
                    <dd className="t-body mt-2 text-warm">
                      Monday to Friday, 08:00 to 17:00 SAST
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-12 text-quiet">
                  <Logo size={24} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
