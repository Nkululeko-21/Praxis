import ScrollHero from '../components/ScrollHero';
import PipelineDiagram from '../components/PipelineDiagram';
import CTABand from '../components/CTABand';
import { SectionHead, LineItem, Reveal, TextLink } from '../components/ui';
import { SERVICES } from '../lib/services';

/* The cost of manual work, stated as the reader would recognise it. */
const SYMPTOMS = [
  {
    index: '01',
    title: 'The same information is typed twice',
    body: 'An enquiry arrives on WhatsApp, gets copied into a spreadsheet, then copied again into an invoice. Each copy is a chance to introduce an error, and none of them add anything.',
  },
  {
    index: '02',
    title: 'Following up depends on somebody remembering',
    body: 'Leads go cold not because they were unqualified but because the follow-up sat behind three other jobs. Nobody can say how many, because nothing recorded it.',
  },
  {
    index: '03',
    title: 'The month-end takes a week',
    body: 'Statements are reconciled by eye, receipts are chased by hand, and the report that explains the month arrives after the month it explains.',
  },
  {
    index: '04',
    title: 'Nobody can answer a question without opening four tabs',
    body: 'The numbers exist. They are in the bank portal, the accounting package, a sheet and somebody\'s inbox, and assembling them takes long enough that the question stops being asked.',
  },
];

export default function Home() {
  return (
    <>
      <ScrollHero />

      {/* ---- 01 the problem ---------------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <SectionHead
            index="01"
            eyebrow="The problem"
            title="Most businesses are paying salaries to do a computer's job."
            lede="Not the interesting parts. The retyping, the copying between systems, the chasing, the monthly assembly of figures that already exist somewhere. Here is what it looks like from the inside."
          />

          <div className="mt-16 grid gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-2">
            {SYMPTOMS.map((s, i) => (
              <Reveal key={s.index} delay={i * 60}>
                <div className="hairline pt-7">
                  <span className="t-caption text-quiet">{s.index}</span>
                  <h3 className="t-h3 mt-3 text-warm">{s.title}</h3>
                  <p className="t-body mt-3 text-quiet">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="t-body-lg measure mt-16 text-warm">
              None of this is a discipline problem. It is a systems problem, and it
              has the shape of something a workflow can hold.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 02 services -------------------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <SectionHead
            index="02"
            eyebrow="Services"
            title="Four things we build."
            lede="Priced by scope, not by hour. Every engagement starts with the same question: which task in this business is done more than once a week, the same way each time?"
          />

          <div className="mt-14 lg:mt-16">
            {SERVICES.map((s) => (
              <LineItem
                key={s.slug}
                index={s.index}
                title={s.title}
                description={s.oneLine}
                figure={s.lead}
                to="/services"
              />
            ))}
            <div className="hairline" aria-hidden="true" />
          </div>

          <Reveal>
            <p className="t-small mt-8 text-quiet">
              <TextLink to="/services">Each pillar, with a before and after →</TextLink>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 03 the workflow ---------------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <SectionHead
            index="03"
            eyebrow="Method"
            title="Every workflow we build has the same six parts."
            lede="It is worth knowing the shape, because it is how we scope the work and how you will read the dashboard afterwards."
          />

          <div className="mt-16 lg:mt-20">
            <PipelineDiagram />
          </div>

          <Reveal>
            <p className="t-small mt-12 text-quiet">
              <TextLink to="/how-it-works">The full sequence, stage by stage →</TextLink>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 04 proof ------------------------------------------------ */}
      <section className="hairline">
        <div className="shell section-pad">
          <SectionHead
            index="04"
            eyebrow="What it is worth"
            title="A worked example, with the arithmetic shown."
            lede="These are modelled figures for a ten-person business, not a client result. We would rather show you the method than a number you cannot check."
          />

          <div className="mt-16 lg:mt-20">
            <div className="hairline grid grid-cols-12 items-baseline gap-x-6 gap-y-1 py-6">
              <span className="col-span-8 t-small text-quiet sm:col-span-9">
                Enquiries retyped into the CRM, 40 a week at 4 minutes
              </span>
              <span className="col-span-4 t-small text-right text-warm sm:col-span-3">11.6 hrs / month</span>
            </div>
            <div className="hairline grid grid-cols-12 items-baseline gap-x-6 gap-y-1 py-6">
              <span className="col-span-8 t-small text-quiet sm:col-span-9">
                Supplier invoices keyed into the ledger, 60 a month at 6 minutes
              </span>
              <span className="col-span-4 t-small text-right text-warm sm:col-span-3">6.0 hrs / month</span>
            </div>
            <div className="hairline grid grid-cols-12 items-baseline gap-x-6 gap-y-1 py-6">
              <span className="col-span-8 t-small text-quiet sm:col-span-9">
                Weekly figures assembled by hand, 4 times at 90 minutes
              </span>
              <span className="col-span-4 t-small text-right text-warm sm:col-span-3">6.0 hrs / month</span>
            </div>
            <div className="hairline grid grid-cols-12 items-baseline gap-x-6 gap-y-1 py-6">
              <span className="col-span-8 t-small text-quiet sm:col-span-9">
                Payment reminders chased individually, 25 a month at 5 minutes
              </span>
              <span className="col-span-4 t-small text-right text-warm sm:col-span-3">2.1 hrs / month</span>
            </div>

            {/* the total, closed by the double rule — §32 */}
            <Reveal>
              <div className="mt-2 grid grid-cols-12 items-baseline gap-x-6 py-6">
                <span className="col-span-6 t-label text-quiet sm:col-span-9">Recoverable, per month</span>
                <span
                  className="col-span-6 text-right text-warm sm:col-span-3"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '30px', lineHeight: 1.2 }}
                >
                  25.7 hrs
                </span>
              </div>
              <div aria-hidden="true">
                <div className="h-px w-full bg-warm/45" />
                <div className="mt-[3px] h-px w-full bg-warm/45" />
              </div>
            </Reveal>

            <Reveal>
              <p className="t-small measure mt-8 text-quiet">
                Three working days a month, returned to the people you already employ.
                What that is worth depends on what they would otherwise be doing, which
                is a question only you can answer — and the reason the audit asks about
                it rather than assuming.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- 05 audit ------------------------------------------------ */}
      <CTABand index="05" />
    </>
  );
}
