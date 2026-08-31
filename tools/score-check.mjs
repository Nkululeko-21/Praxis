import { QUESTIONS } from '../src/audit/questions.js';
import { scoreAudit } from '../src/audit/scoring.js';

const profiles = {
  'all worst  (index 0)': () => 0,
  'all second (index 1)': () => 1,
  'all third  (index 2)': () => 2,
  'all best   (index 3)': (q) => q.options.length - 1,
  'mixed 0/2 alternating': (q, i) => (i % 2 ? 2 : 0),
};

for (const [name, pick] of Object.entries(profiles)) {
  const answers = {};
  QUESTIONS.forEach((q, i) => { answers[q.id] = Math.min(pick(q, i), q.options.length - 1); });
  const r = scoreAudit(answers);
  console.log(
    `${name.padEnd(24)} score ${String(r.score).padStart(3)}/100  ${r.band.name.padEnd(22)} ` +
    `${String(r.hours).padStart(3)} hrs/mo  opps: ${r.opportunities.length}`,
  );
}
console.log('\ncategories covered:', [...new Set(QUESTIONS.map(q => q.category))].join(', '));
console.log('question count:', QUESTIONS.length);
