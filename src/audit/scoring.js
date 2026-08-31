import { QUESTIONS, OPPORTUNITIES } from './questions.js';

/* ==================================================================
   Turning sixteen answers into a result.

   Three outputs, each with its assumptions stated on screen rather than
   buried here, per §24.01 and §24.03:

     score          readiness out of 100
     hours          an estimate of recoverable hours per month
     opportunities  the three weakest areas Praxis can actually act on

   Nothing here is stored, sent or logged. The answers live in component
   state and disappear when the tab closes.
   ================================================================== */

/* Automation removes most of a manual task, never all of it. Exceptions,
   review and the occasional failure stay with a person. */
const RECOVERY_RATE = 0.55;

/* The questions overlap on purpose — the same hour can be counted by
   both the lead-capture question and the systems-integration question,
   because it is genuinely both. This discount stops those overlaps
   compounding into a number nobody would believe. */
const OVERLAP_DISCOUNT = 0.7;

export const BANDS = [
  {
    max: 34,
    name: 'Substantially manual',
    verdict:
      'Most of the recurring work in this business is still done by a person, step by step. That is the position with the most to recover, and the one where the first workflow usually pays for itself fastest.',
  },
  {
    max: 59,
    name: 'Partly systematised',
    verdict:
      'Some of the process holds and some of it depends on people remembering. The useful next move is usually to finish one workflow properly rather than to start three.',
  },
  {
    max: 79,
    name: 'Mostly systematised',
    verdict:
      'The foundations are in place and the obvious gaps are narrow ones. What is left tends to be the connective work between systems, which is cheap to build and easy to measure.',
  },
  {
    max: 100,
    name: 'Systematised',
    verdict:
      'This business already runs on systems. There may be a case for a specific workflow, but it would be a considered addition rather than a repair — and it is worth saying plainly that you may not need us yet.',
  },
];

export function bandFor(score) {
  return BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1];
}

/**
 * @param {Record<string, number>} answers  question id -> selected option index
 */
export function scoreAudit(answers) {
  let weighted = 0;
  let weightedMax = 0;
  let rawHours = 0;
  let scale = 1;
  const impacts = [];
  const byCategory = {};

  QUESTIONS.forEach((q, order) => {
    const chosen = answers[q.id];
    if (chosen == null) return;
    const option = q.options[chosen];
    if (!option) return;

    /* Per-question maximum, not a fixed 3. One question's best available
       answer scores 2, and treating it as though 3 were reachable would
       make a perfect set of answers score less than 100. */
    const qMax = Math.max(...q.options.map((o) => o.score));

    weighted += option.score * q.weight;
    weightedMax += qMax * q.weight;
    rawHours += option.hours ?? 0;
    if (option.scale) scale = option.scale;

    const cat = (byCategory[q.category] ??= { got: 0, max: 0 });
    cat.got += option.score * q.weight;
    cat.max += qMax * q.weight;

    if (q.opportunity && OPPORTUNITIES[q.opportunity]) {
      const gap = (qMax - option.score) * q.weight;
      if (gap > 0) impacts.push({ key: q.opportunity, gap, order });
    }
  });

  const score = weightedMax === 0 ? 0 : Math.round((weighted / weightedMax) * 100);

  /* Recoverable hours, rounded to the nearest 5 — the inputs are
     estimates, and a figure like "37 hours" claims a precision the
     method does not have. */
  const hoursExact = rawHours * RECOVERY_RATE * OVERLAP_DISCOUNT * scale;
  const hours = Math.max(0, Math.round(hoursExact / 5) * 5);

  /* Largest gap first; ties fall back to question order, so the result
     is deterministic rather than dependent on sort stability. */
  const opportunities = impacts
    .sort((a, b) => b.gap - a.gap || a.order - b.order)
    .slice(0, 3)
    .map((i) => ({ ...OPPORTUNITIES[i.key], key: i.key }));

  const categories = Object.entries(byCategory)
    .map(([name, v]) => ({ name, pct: v.max ? Math.round((v.got / v.max) * 100) : 0 }))
    .sort((a, b) => a.pct - b.pct);

  return { score, band: bandFor(score), hours, opportunities, categories };
}
