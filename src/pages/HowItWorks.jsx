import PageHeader from '../components/PageHeader';
import Backdrop from '../components/Backdrop';
import PipelineDiagram from '../components/PipelineDiagram';
import CTABand from '../components/CTABand';
import { Reveal } from '../components/ui';
import { STAGES } from '../lib/pipeline';

/* The engagement, separate from the workflow. Readers conflate the two,
   so they are stated apart: this is what we do with you, the diagram
   above is what the software does once we leave. */
const ENGAGEMENT = [
  {
    index: '01',
    name: 'Audit',
    duration: '1 week',
    body: 'We watch the work as it is currently done and count it. Which tasks repeat, how often, how long each takes, and what breaks when they are skipped. You get the list whether or not you continue.',
  },
  {
    index: '02',
    name: 'Scope',
    duration: '3 to 5 days',
    body: 'The list becomes a written scope: which workflows, in what order, what each one will and will not do, the timeline and the cost. Nothing starts before you have that document.',
  },
  {
    index: '03',
    name: 'Build',
    duration: '2 to 7 weeks',
    body: 'The workflows are built one at a time, smallest first, so something is running before the whole scope is finished. You see each one in a staging environment before it touches live data.',
  },
  {
    index: '04',
    name: 'Handover',
    duration: '1 week',
    body: 'Documentation, the dashboard, and a session with whoever will own it. You get the account credentials and the workflow definitions. There is no lock-in mechanism, deliberately.',
  },
  {
    index: '05',
    name: 'Support',
    duration: 'Monthly, optional',
    body: 'Monitoring, failures triaged, and changes as the business changes. Priced monthly and cancellable monthly. If nothing needs doing, we say so rather than inventing work.',
  },
];

export default function HowItWorks() {
  return (
    <>
      <PageHeader
        backdrop={
          <Backdrop shape="dashboard" className="hidden lg:block right-16 top-[196px] w-[300px]" />
        }
        eyebrow="How it works"
        title="Trigger, filter, intelligence, formatter, action, output."
        lede="Every workflow we build is assembled from these six stages, in this order. Knowing the sequence is what lets you read your own system later — and what lets you tell whether a proposal you get from anyone else is complete."
      />

      {/* ---- 01 the diagram ---------------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span
                className="text-quiet"
                style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                aria-hidden="true"
              >
                01
              </span>
              <span className="t-label text-quiet">The sequence</span>
            </div>
          </Reveal>

          <div className="mt-14 lg:mt-16">
            <PipelineDiagram />
          </div>

          <Reveal>
            <p className="t-small measure mt-14 text-quiet">
              A workflow that is missing a stage is usually the one that fails. No
              filter, and it acts on duplicates. No formatter, and it writes data the
              destination rejects. No output, and nobody notices for a month that it
              stopped running.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- 02 each stage, in full --------------------------------- */}
      <section className="hairline">
        <div className="shell section-pad">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span
                className="text-quiet"
                style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                aria-hidden="true"
              >
                02
              </span>
              <span className="t-label text-quiet">Stage by stage</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-h1 measure-display mt-5 text-warm">
              Followed through one enquiry, from arrival to record.
            </h2>
          </Reveal>

          <div className="mt-16 lg:mt-20">
            {STAGES.map((stage) => (
              <Reveal key={stage.name}>
                <article className="hairline grid gap-8 py-10 lg:grid-cols-12 lg:py-12">
                  <div className="lg:col-span-3">
                    <span className="t-caption text-quiet">{stage.index}</span>
                    <h3 className="t-h2 mt-2 text-warm">{stage.name}</h3>
                    <p className="t-small mt-2 text-quiet">{stage.short}</p>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="t-body text-quiet">{stage.detail}</p>
                  </div>

                  <div className="lg:col-span-3 lg:col-start-10">
                    <h4 className="t-label text-quiet">In this example</h4>
                    <p className="t-small mt-3 text-warm">{stage.example}</p>
                    <h4 className="t-label mt-7 text-quiet">The limit</h4>
                    <p className="t-small mt-3 text-quiet">{stage.limit}</p>
                  </div>
                </article>
              </Reveal>
            ))}
            <div className="hairline" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ---- 03 the engagement -------------------------------------- */}
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
              <span className="t-label text-quiet">Working with us</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-h1 measure-display mt-5 text-warm">
              What happens between the first message and a system you own.
            </h2>
          </Reveal>

          <div className="mt-14 lg:mt-16">
            {ENGAGEMENT.map((step) => (
              <Reveal key={step.index}>
                <div className="hairline grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-7">
                  <span className="col-span-2 t-caption text-quiet sm:col-span-1">{step.index}</span>
                  <h3 className="col-span-10 t-h3 text-warm sm:col-span-3">{step.name}</h3>
                  <p className="col-span-12 t-small text-quiet sm:col-span-6 sm:col-start-5">{step.body}</p>
                  <span className="col-span-12 t-caption text-quiet sm:col-span-2 sm:text-right">
                    {step.duration}
                  </span>
                </div>
              </Reveal>
            ))}
            <div className="hairline" aria-hidden="true" />
          </div>
        </div>
      </section>

      <CTABand
        index="04"
        title="The audit is the first stage, and it stands on its own."
        body="Sixteen questions about how the work is done now. You get a readiness score, the three highest-impact opportunities and an estimate of the hours a month you could recover — whether or not you go any further."
      />
    </>
  );
}
