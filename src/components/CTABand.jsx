import { ButtonLink, Reveal } from './ui';
import { whatsappLink, MESSAGES, WHATSAPP_DISPLAY } from '../lib/contact';

/**
 * The section CTA. The audit is always the first action; WhatsApp is the
 * alternative for someone who would rather just ask. No urgency device,
 * no scarcity, per §24.04 — the second line states what happens next
 * instead of pressing for a decision.
 */
export default function CTABand({
  index,
  title = 'Find out what is automatable in your business.',
  body = 'The audit is 16 questions and takes about four minutes. It returns a readiness score, the three highest-impact opportunities for your answers, and an estimate of the hours a month you could recover.',
  primaryLabel = 'Get an audit',
  message = MESSAGES.general,
}) {
  return (
    <section className="hairline">
      <div className="shell section-pad">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {index && (
              <Reveal>
                <span
                  className="text-quiet"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {index}
                </span>
              </Reveal>
            )}
            <Reveal delay={60}>
              <h2 className="t-h1 measure-display mt-5 text-warm">{title}</h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="t-body-lg measure mt-6 text-quiet">{body}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={140}>
              <div className="flex flex-col gap-4">
                <ButtonLink to="/audit">{primaryLabel}</ButtonLink>
                <ButtonLink href={whatsappLink(message)} variant="secondary">
                  Message us on WhatsApp
                </ButtonLink>
                <p className="t-caption text-quiet">
                  {WHATSAPP_DISPLAY} · replies during business hours, Eswatini time.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
