import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTIONS } from '../audit/questions.js';
import { scoreAudit } from '../audit/scoring.js';
import { Button, ButtonLink, Reveal } from '../components/ui';
import { whatsappLink, quoteMessage, WHATSAPP_DISPLAY, MESSAGES } from '../lib/contact';

/* ==================================================================
   The automation audit.

   One question per screen, a progress rule, a back button, no account
   and no email gate. Every answer lives in this component's state and
   nowhere else — there is no backend, no storage and no request. The
   only thing that ever leaves the browser is the summary the reader
   chooses to send to WhatsApp at the end.
   ================================================================== */

const TOTAL = QUESTIONS.length;

/* ---- progress ---------------------------------------------------- */
function Progress({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="sticky top-[72px] z-30 bg-charcoal/95 backdrop-blur-sm">
      <div className="shell flex items-center gap-4 py-4">
        <span className="t-label shrink-0 text-quiet">
          {String(current).padStart(2, '0')} / {total}
        </span>
        <div
          className="h-px flex-1 bg-[color:var(--hair)]"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Audit progress"
        >
          <div
            className="h-px bg-warm transition-[width] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---- one question ------------------------------------------------ */
function QuestionScreen({ question, index, selected, onSelect, onBack, onNext }) {
  const headingRef = useRef(null);

  /* Move focus to the new question so a screen reader and a keyboard
     user both land in the right place after an advance. */
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  useEffect(() => {
    const onKey = (e) => {
      const n = Number(e.key);
      if (n >= 1 && n <= question.options.length) {
        e.preventDefault();
        onSelect(n - 1);
      } else if (e.key === 'ArrowLeft') {
        onBack();
      } else if (e.key === 'ArrowRight' && selected != null) {
        onNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [question, selected, onSelect, onBack, onNext]);

  return (
    <div className="shell pb-24 pt-10 lg:pt-16">
      <div className="max-w-[46rem]">
        <p className="t-label text-quiet">{question.category}</p>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="t-h1 mt-5 text-warm outline-none"
        >
          {question.question}
        </h1>

        {question.help && <p className="t-small measure mt-4 text-quiet">{question.help}</p>}

        <div role="radiogroup" aria-label={question.question} className="mt-10 border-t border-[color:var(--hair)]">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(i)}
                className={`group flex w-full items-start gap-5 border-b border-[color:var(--hair)] px-2 py-5 text-left
                  transition-colors duration-150 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                  ${isSelected ? 'bg-panel-2' : 'hover:bg-panel'}`}
              >
                {/* the selection mark — a square, filled when chosen */}
                <span
                  aria-hidden="true"
                  className="mt-1 grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors duration-150"
                  style={{
                    borderColor: isSelected ? 'var(--color-warm)' : 'var(--hair-strong)',
                  }}
                >
                  <span
                    className="block transition-all duration-150"
                    style={{
                      width: isSelected ? 8 : 0,
                      height: isSelected ? 8 : 0,
                      background: 'var(--color-warm)',
                    }}
                  />
                </span>
                <span className={`t-body ${isSelected ? 'text-warm' : 'text-quiet group-hover:text-warm'}`}>
                  {option.label}
                </span>
                <span className="ml-auto hidden shrink-0 self-center t-caption text-quiet/50 lg:block" aria-hidden="true">
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button variant="secondary" onClick={onBack} disabled={index === 0} className={index === 0 ? 'opacity-40' : ''}>
            Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="hidden t-caption text-quiet sm:block">
              Press 1 to {question.options.length} to answer
            </span>
            <Button onClick={onNext} disabled={selected == null} className={selected == null ? 'opacity-40' : ''}>
              {index === TOTAL - 1 ? 'See the result' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- the quote handoff -------------------------------------------- */
function QuoteForm({ result }) {
  const [values, setValues] = useState({ name: '', business: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(null);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  /* §22 — errors are stated in plain language beneath the field: what is
     wrong and what to do, never a red outline on its own. */
  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = 'We need a name to address the reply to.';
    if (!values.business.trim()) next.business = 'Tell us the business name so we know what we are quoting for.';

    const digits = values.phone.replace(/\D/g, '');
    if (!digits) next.phone = 'Add the WhatsApp number we should reply on.';
    else if (digits.length < 8) next.phone = 'That looks short. Include the full number, with the country code if you are outside Eswatini.';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      setReady(null);
      return;
    }
    const message = quoteMessage({
      name: values.name.trim(),
      business: values.business.trim(),
      phone: values.phone.trim(),
      score: result.score,
      band: result.band.name,
      hours: result.hours,
      opportunities: result.opportunities,
    });
    setReady(whatsappLink(message));
  }

  const field =
    'h-11 w-full rounded-[3px] border bg-panel px-3 text-warm placeholder:text-quiet/50 ' +
    'transition-colors duration-150 focus:border-warm focus:outline-none';

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[34rem]">
      <div className="space-y-6">
        {[
          { key: 'name', label: 'Your name', placeholder: 'Thandi Dlamini', type: 'text', autoComplete: 'name' },
          { key: 'business', label: 'Business name', placeholder: 'Lobamba Hardware', type: 'text', autoComplete: 'organization' },
          { key: 'phone', label: 'WhatsApp number', placeholder: '+268 7612 3456', type: 'tel', autoComplete: 'tel' },
        ].map((f) => (
          <div key={f.key}>
            {/* §22 — label above the field, 12px sans in slate */}
            <label htmlFor={`quote-${f.key}`} className="t-caption block text-quiet">
              {f.label}
            </label>
            <input
              id={`quote-${f.key}`}
              type={f.type}
              autoComplete={f.autoComplete}
              value={values[f.key]}
              onChange={set(f.key)}
              placeholder={f.placeholder}
              aria-invalid={errors[f.key] ? 'true' : undefined}
              aria-describedby={errors[f.key] ? `quote-${f.key}-error` : undefined}
              className={`${field} mt-3`}
              style={{ borderColor: errors[f.key] ? 'var(--color-ember)' : 'var(--hair-strong)' }}
            />
            {errors[f.key] && (
              <p id={`quote-${f.key}-error`} className="t-small mt-2 text-ember">
                {errors[f.key]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {ready ? (
          <div>
            <ButtonLink href={ready}>Open WhatsApp with your result</ButtonLink>
            <p className="t-caption mt-4 text-quiet">
              Your score and the three opportunities are already written into the message.
              Read it before you send it — nothing goes anywhere until you press send in
              WhatsApp.
            </p>
          </div>
        ) : (
          <>
            <Button type="submit">Get a free quote</Button>
            <p className="t-caption mt-4 text-quiet">
              This composes a WhatsApp message to {WHATSAPP_DISPLAY} with your result
              attached. Nothing is stored and nothing is sent until you press send.
            </p>
          </>
        )}
      </div>
    </form>
  );
}

/* ---- the result --------------------------------------------------- */
function ResultScreen({ result, onRestart }) {
  const { score, band, hours, opportunities, categories } = result;

  return (
    <div className="pb-8">
      {/* the score */}
      <section>
        <div className="shell pb-16 pt-12 lg:pt-16">
          <Reveal>
            <p className="t-label text-quiet">Your result</p>
          </Reveal>

          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal delay={60}>
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-warm"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4.5rem,14vw,7.5rem)', lineHeight: 0.9 }}
                  >
                    {score}
                  </span>
                  <span className="t-h2 text-quiet">/ 100</span>
                </div>
                <p className="t-label mt-6 text-quiet">Automation readiness</p>
                <h1 className="t-h2 mt-2 text-warm">{band.name}</h1>

                {/* the double rule, closing the figure — §32 */}
                <div className="mt-6 max-w-[18rem]" aria-hidden="true">
                  <div className="h-px w-full bg-warm/45" />
                  <div className="mt-[3px] h-px w-full bg-warm/45" />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={120}>
                <p className="t-body-lg text-quiet">{band.verdict}</p>
              </Reveal>

              <Reveal delay={170}>
                <div className="mt-10 border-t border-[color:var(--hair)] pt-6">
                  <p className="t-label text-quiet">Estimated recoverable time</p>
                  <p className="mt-3">
                    <span
                      className="text-warm"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '44px', lineHeight: 1.1 }}
                    >
                      about {hours} hours
                    </span>
                    <span className="t-body-lg text-quiet"> a month</span>
                  </p>
                  <p className="t-small mt-4 text-quiet">
                    An estimate, not a quote. It assumes automation removes roughly 55% of
                    the time each task currently takes — exceptions and review stay with a
                    person — and it discounts the overlap between your answers. We would
                    confirm it by counting the real work before quoting.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* the three opportunities */}
      <section className="hairline">
        <div className="shell py-16 lg:py-20">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span
                className="text-quiet"
                style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                aria-hidden="true"
              >
                01
              </span>
              <span className="t-label text-quiet">Highest impact first</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-h1 measure-display mt-5 text-warm">
              {opportunities.length === 0
                ? 'Nothing here is worth automating yet.'
                : `Three places where a system would take work off people.`}
            </h2>
          </Reveal>

          {opportunities.length === 0 ? (
            <Reveal delay={110}>
              <p className="t-body-lg measure mt-6 text-quiet">
                Your answers describe a business that already runs on systems. There may
                still be a case for a specific workflow, but we would be inventing one to
                sell it, and that is not how we work. Send us the result anyway if you
                want a second opinion on a particular process.
              </p>
            </Reveal>
          ) : (
            <div className="mt-12 lg:mt-14">
              {opportunities.map((o, i) => (
                <Reveal key={o.key} delay={i * 70}>
                  <article className="hairline grid gap-4 py-8 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-1">
                      <span className="t-caption text-quiet">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="lg:col-span-7">
                      <h3 className="t-h3 text-warm">{o.title}</h3>
                      <p className="t-small mt-3 text-quiet">{o.body}</p>
                    </div>
                    <div className="lg:col-span-3 lg:col-start-10">
                      <p className="t-label text-quiet">Service</p>
                      <p className="t-small mt-2">
                        <Link
                          to={`/services#${o.slug}`}
                          className="text-warm underline underline-offset-[3px] decoration-[color:var(--hair-strong)] hover:text-ember hover:decoration-ember"
                        >
                          {o.service}
                        </Link>
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
              <div className="hairline" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>

      {/* where the score came from */}
      <section className="hairline">
        <div className="shell py-16 lg:py-20">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span
                className="text-quiet"
                style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                aria-hidden="true"
              >
                02
              </span>
              <span className="t-label text-quiet">By area</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-h1 measure-display mt-5 text-warm">Where the score came from.</h2>
          </Reveal>

          <div className="mt-12 max-w-[46rem]">
            {categories.map((c) => (
              <Reveal key={c.name}>
                <div className="hairline flex items-center gap-6 py-5">
                  <span className="t-small w-40 shrink-0 text-quiet">{c.name}</span>
                  <span className="h-px flex-1 bg-[color:var(--hair)]" aria-hidden="true">
                    <span className="block h-px bg-warm/60" style={{ width: `${c.pct}%` }} />
                  </span>
                  <span className="t-caption w-12 shrink-0 text-right text-warm">{c.pct}%</span>
                </div>
              </Reveal>
            ))}
            <div className="hairline" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* the quote */}
      <section className="hairline">
        <div className="shell py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-quiet"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '40px', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    03
                  </span>
                  <span className="t-label text-quiet">Next step</span>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="t-h1 mt-5 text-warm">Get a free quote.</h2>
              </Reveal>
              <Reveal delay={110}>
                <p className="t-body measure mt-6 text-quiet">
                  Three fields. We reply on WhatsApp with a scope and a figure for the
                  first workflow, usually within one working day. If we think the spend is
                  not justified yet, we will tell you that instead.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={140}>
                <QuoteForm result={result} />
              </Reveal>
            </div>
          </div>

          <Reveal>
            <div className="mt-16 flex flex-wrap items-center gap-6">
              <Button variant="secondary" onClick={onRestart}>Start the audit again</Button>
              <ButtonLink href={whatsappLink(MESSAGES.general)} variant="secondary">
                Just message us instead
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---- intro --------------------------------------------------------- */
function IntroScreen({ onStart }) {
  return (
    <div className="shell pb-24 pt-[136px] lg:pt-[184px]">
      <Reveal>
        <p className="t-label text-quiet">Automation audit</p>
      </Reveal>
      <Reveal delay={70}>
        <h1 className="t-display measure-display mt-6 text-warm">
          Sixteen questions about how the work actually gets done.
        </h1>
      </Reveal>
      <Reveal delay={130}>
        <p className="t-body-lg measure mt-8 text-quiet">
          At the end you get an automation readiness score, the three highest-impact
          things to automate for your answers, and an estimate of the hours a month you
          could recover. It takes about four minutes.
        </p>
      </Reveal>

      <Reveal delay={180}>
        <dl className="mt-12 max-w-[38rem] border-t border-[color:var(--hair)]">
          {[
            ['No account', 'There is nothing to sign up for and no email required.'],
            ['Nothing is stored', 'Your answers stay in this browser tab and are gone when you close it.'],
            ['You can go back', 'Every question has a back button. Nothing is final until the end.'],
          ].map(([term, desc]) => (
            <div key={term} className="flex flex-col gap-1 border-b border-[color:var(--hair)] py-4 sm:flex-row sm:gap-8">
              <dt className="t-label w-40 shrink-0 pt-1 text-quiet">{term}</dt>
              <dd className="t-small text-warm">{desc}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={230}>
        <div className="mt-10">
          <Button onClick={onStart}>Start the audit</Button>
        </div>
      </Reveal>
    </div>
  );
}

/* ==================================================================== */
export default function Audit() {
  const [phase, setPhase] = useState('intro');   // intro | quiz | result
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const question = QUESTIONS[index];
  const selected = question ? answers[question.id] : null;

  const finish = useCallback((finalAnswers) => {
    setResult(scoreAudit(finalAnswers));
    setPhase('result');
    window.scrollTo(0, 0);
  }, []);

  const select = useCallback(
    (optionIndex) => {
      const q = QUESTIONS[index];
      const next = { ...answers, [q.id]: optionIndex };
      setAnswers(next);

      /* A short pause so the selection is visible before the screen
         changes. Instant advance reads as though the tap was ignored. */
      window.setTimeout(() => {
        if (index === TOTAL - 1) finish(next);
        else setIndex((i) => Math.min(i + 1, TOTAL - 1));
      }, 240);
    },
    [answers, index, finish],
  );

  const next = useCallback(() => {
    if (answers[QUESTIONS[index].id] == null) return;
    if (index === TOTAL - 1) finish(answers);
    else setIndex((i) => i + 1);
  }, [answers, index, finish]);

  const back = useCallback(() => {
    if (index === 0) { setPhase('intro'); return; }
    setIndex((i) => Math.max(0, i - 1));
  }, [index]);

  function restart() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setPhase('intro');
    window.scrollTo(0, 0);
  }

  if (phase === 'intro') return <IntroScreen onStart={() => setPhase('quiz')} />;

  if (phase === 'result' && result) {
    return (
      <div className="pt-[72px]">
        <ResultScreen result={result} onRestart={restart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px]">
      <Progress current={index + 1} total={TOTAL} />
      <QuestionScreen
        question={question}
        index={index}
        selected={selected ?? null}
        onSelect={select}
        onBack={back}
        onNext={next}
      />
    </div>
  );
}
