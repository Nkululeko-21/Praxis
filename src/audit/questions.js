/* ==================================================================
   The Praxis automation audit — 16 questions.

   The brief referenced an existing 15-question KQR quiz ("Is your
   business ready to scale?"). That file was not supplied with the brief,
   so all sixteen are written here against the categories it named:
   Foundation, Digital Presence, Brand & Identity, Marketing, Payments &
   Finance, Operations, Customer Experience, Team & HR, Technology &
   Data, Growth & Strategy, plus the AI and automation readiness question
   the brief asked to be added. If the original wording turns up, the
   `question` and `options` strings are the only things that need to
   change — scoring reads `score`, `hours` and `weight`, nothing else.

   Weighting. Eight of the sixteen are there to detect repetitive manual
   work, and they carry the heaviest weights, because that is what Praxis
   sells against. The rest establish whether the foundations exist to
   sustain an automation once it is built — a workflow on top of records
   nobody keeps is a liability, not a saving.

   Scoring convention, uniform across every question:

     score 0  the work is entirely manual, or the foundation is absent
     score 1  partly handled, inconsistently
     score 2  handled consistently, still by a person
     score 3  already systematised

   `hours` is an estimate of the hours per month a person currently
   spends on that task, for a business of average size. It is scaled by
   the answer to Q14 and stated as an estimate, never as a promise.

   Note that `hours` is deliberately not monotonic with `score`. A
   business that does not chase debtors at all spends no time chasing
   them; a business that chases them by hand every week spends a great
   deal. The lower score still describes the worse position, but the
   recoverable time belongs to the one already doing the work.

   Copy follows §24-25: sentence case, plain register, no urgency, no
   banned words. Every question has a "no" option that does not read as
   a failure, because a diagnostic that punishes honesty collects
   nothing useful.
   ================================================================== */

export const QUESTIONS = [
  /* ---- 1. Foundation --------------------------------------------- */
  {
    id: 'foundation-records',
    category: 'Foundation',
    weight: 2,
    question: 'Where do the records of the business actually live?',
    help: 'Customers, jobs, quotes, prices — the things you would need if a key person were away for a month.',
    options: [
      { label: 'Mostly in people\'s heads, phones and notebooks', score: 0 },
      { label: 'In spreadsheets and chat threads, spread across a few devices', score: 1 },
      { label: 'In shared files everyone can reach, kept up to date by hand', score: 2 },
      { label: 'In proper systems that are the single source for each thing', score: 3 },
    ],
  },

  /* ---- 2. Growth & Strategy -------------------------------------- */
  {
    id: 'growth-constraint',
    category: 'Growth & Strategy',
    weight: 2,
    opportunity: 'capacity',
    question: 'If twice as much work arrived next month, what would break first?',
    options: [
      { label: 'Everything — we are already at the limit of what we can handle', score: 0, hours: 8 },
      { label: 'The admin. Delivery would cope, the paperwork behind it would not', score: 1, hours: 6 },
      { label: 'We would need to hire, but we would manage the transition', score: 2, hours: 3 },
      { label: 'Very little. The systems would absorb it', score: 3, hours: 0 },
    ],
  },

  /* ---- 3. Digital Presence --------------------------------------- */
  {
    id: 'presence-website',
    category: 'Digital Presence',
    weight: 1,
    question: 'What does the business have online?',
    options: [
      { label: 'Nothing, or a page someone set up years ago', score: 0 },
      { label: 'A social profile only', score: 1 },
      { label: 'A website that describes what we do', score: 2 },
      { label: 'A website that also takes enquiries or bookings directly', score: 3 },
    ],
  },

  /* ---- 4. Digital Presence --------------------------------------- */
  {
    id: 'presence-social',
    category: 'Digital Presence',
    weight: 1,
    opportunity: 'content',
    question: 'How is the social media presence run?',
    options: [
      { label: 'It is not, really. We post when we remember', score: 0, hours: 4 },
      { label: 'One person posts in gaps between other work', score: 1, hours: 8 },
      { label: 'There is a rough schedule, kept to most weeks', score: 2, hours: 6 },
      { label: 'Planned and scheduled in advance, with results tracked', score: 3, hours: 0 },
    ],
  },

  /* ---- 5. Brand & Identity --------------------------------------- */
  {
    id: 'brand-consistency',
    category: 'Brand & Identity',
    weight: 1,
    question: 'When someone in the business sends a quote or a proposal, what does it look like?',
    options: [
      { label: 'Different every time, depending on who wrote it', score: 0 },
      { label: 'Roughly similar — people copy the last one they can find', score: 1 },
      { label: 'There is a template, and most people use it', score: 2 },
      { label: 'Generated from one template automatically, so it cannot drift', score: 3 },
    ],
  },

  /* ---- 6. Marketing ---------------------------------------------- */
  {
    id: 'marketing-attribution',
    category: 'Marketing',
    weight: 2,
    opportunity: 'reporting',
    question: 'Can you say where last month\'s customers came from?',
    options: [
      { label: 'No. We have a sense of it, but nothing recorded', score: 0, hours: 0 },
      { label: 'Roughly, by asking people and remembering', score: 1, hours: 2 },
      { label: 'Yes, because someone compiles it by hand each month', score: 2, hours: 5 },
      { label: 'Yes, it is on a dashboard that updates itself', score: 3, hours: 0 },
    ],
  },

  /* ---- 7. Lead capture — repetitive work -------------------------- */
  {
    id: 'leads-capture',
    category: 'Marketing',
    weight: 4,
    opportunity: 'lead-capture',
    question: 'When an enquiry arrives, what happens to it?',
    help: 'Across every channel — WhatsApp, calls, email, walk-ins, social messages.',
    options: [
      { label: 'It sits in whichever inbox it landed in until someone opens it', score: 0, hours: 10 },
      { label: 'Someone reads it and types the details into a spreadsheet', score: 1, hours: 12 },
      { label: 'It goes into a shared list that the team keeps updated by hand', score: 2, hours: 7 },
      { label: 'It is captured automatically into one place, from every channel', score: 3, hours: 0 },
    ],
  },

  /* ---- 8. Lead follow-up — repetitive work ------------------------ */
  {
    id: 'leads-followup',
    category: 'Marketing',
    weight: 4,
    opportunity: 'lead-followup',
    question: 'How does an enquiry get followed up?',
    options: [
      { label: 'Whoever remembers, when they remember', score: 0, hours: 9 },
      { label: 'One person owns it and works through the list manually', score: 1, hours: 11 },
      { label: 'There is an agreed process, followed by hand and mostly kept to', score: 2, hours: 6 },
      { label: 'Reminders and escalations fire on their own if nothing has happened', score: 3, hours: 0 },
    ],
  },

  /* ---- 9. Customer Experience — repetitive work -------------------- */
  {
    id: 'cx-repeat-questions',
    category: 'Customer Experience',
    weight: 3,
    opportunity: 'customer-comms',
    question: 'How much of what your team writes to customers is the same thing again?',
    help: 'Prices, opening hours, availability, "where is my order", the same five explanations.',
    options: [
      { label: 'Most of it. The same answers, typed out fresh each time', score: 0, hours: 14 },
      { label: 'A lot of it, and people copy and paste from old messages', score: 1, hours: 10 },
      { label: 'Some of it, and we have saved replies for the common ones', score: 2, hours: 5 },
      { label: 'Little. The common questions are answered before they are asked', score: 3, hours: 0 },
    ],
  },

  /* ---- 10. Payments & Finance — repetitive work -------------------- */
  {
    id: 'finance-invoicing',
    category: 'Payments & Finance',
    weight: 4,
    opportunity: 'invoicing',
    question: 'How does a quote become an invoice?',
    options: [
      { label: 'Both are written out by hand, each time, from scratch', score: 0, hours: 12 },
      { label: 'From a template, with the details retyped into it', score: 1, hours: 9 },
      { label: 'In an accounting package, with the details entered by a person', score: 2, hours: 5 },
      { label: 'The accepted quote becomes the invoice with nothing retyped', score: 3, hours: 0 },
    ],
  },

  /* ---- 11. Payments & Finance — repetitive work -------------------- */
  {
    id: 'finance-supplier-docs',
    category: 'Payments & Finance',
    weight: 4,
    opportunity: 'document-capture',
    question: 'What happens to supplier invoices and receipts?',
    options: [
      { label: 'They pile up and get sorted out near the deadline', score: 0, hours: 11 },
      { label: 'Someone keys each one into the books by hand', score: 1, hours: 13 },
      { label: 'They are captured as they arrive, manually but promptly', score: 2, hours: 7 },
      { label: 'They are read and posted automatically, with a review queue', score: 3, hours: 0 },
    ],
  },

  /* ---- 12. Payments & Finance — repetitive work -------------------- */
  {
    id: 'finance-chasing',
    category: 'Payments & Finance',
    weight: 3,
    opportunity: 'payment-chasing',
    question: 'How do you chase money that is owed to you?',
    options: [
      { label: 'We notice late, then chase individually by phone or message', score: 0, hours: 8 },
      { label: 'Someone goes through the overdue list once a month', score: 1, hours: 6 },
      { label: 'We check weekly and send reminders by hand', score: 2, hours: 5 },
      { label: 'Reminders send themselves on a schedule, and stop when paid', score: 3, hours: 0 },
    ],
  },

  /* ---- 13. Operations — the heaviest signal ------------------------ */
  {
    id: 'ops-repeated-task',
    category: 'Operations',
    weight: 5,
    opportunity: 'process',
    question: 'Think of the single task your team repeats most often. How long does it take, in total, each week?',
    help: 'The same steps, in the same order, on different data. Copying between systems counts.',
    options: [
      { label: 'More than a full day a week across the team', score: 0, hours: 20 },
      { label: 'Around half a day a week', score: 1, hours: 12 },
      { label: 'A couple of hours a week', score: 2, hours: 6 },
      { label: 'Very little — the repetitive parts already run themselves', score: 3, hours: 0 },
    ],
  },

  /* ---- 14. Team & HR — also the sizing question -------------------- */
  {
    id: 'team-admin',
    category: 'Team & HR',
    weight: 2,
    opportunity: 'people-admin',
    question: 'How many people work in the business, and how much of their week goes to admin?',
    help: 'Timesheets, leave, scheduling, payroll preparation, internal reporting.',
    /* This question sizes the business rather than measuring a task, so
       it carries `scale` and no `hours` of its own. The admin load it
       describes is already counted by the operations, finance and
       reporting questions; adding it again here would leave a fully
       systematised business showing recoverable hours it does not have. */
    options: [
      { label: 'Just me, and admin eats a large part of my week', score: 1, scale: 0.7 },
      { label: '2 to 5 of us, with admin spread across everyone', score: 1, scale: 1.0 },
      { label: '6 to 20 of us, with someone partly dedicated to admin', score: 2, scale: 1.5 },
      { label: 'More than 20, with a dedicated admin or finance function', score: 2, scale: 2.0 },
    ],
  },

  /* ---- 15. Technology & Data -------------------------------------- */
  {
    id: 'tech-systems-talk',
    category: 'Technology & Data',
    weight: 4,
    opportunity: 'integration',
    question: 'Do the systems you already pay for talk to each other?',
    options: [
      { label: 'There is only really one system, and it is a spreadsheet', score: 0, hours: 10 },
      { label: 'We use several, and a person moves the data between them', score: 1, hours: 14 },
      { label: 'Some are connected, the rest are bridged by hand', score: 2, hours: 7 },
      { label: 'They are connected, and data is entered once', score: 3, hours: 0 },
    ],
  },

  /* ---- 16. AI and automation readiness ---------------------------- */
  {
    id: 'ai-readiness',
    category: 'Technology & Data',
    weight: 3,
    opportunity: 'ai-workflow',
    question: 'Where does the business stand on automation and AI right now?',
    help: 'Being at the start is a normal answer, and it does not lower what you can recover.',
    options: [
      { label: 'We have not tried anything, and would not know where to begin', score: 0, hours: 0 },
      { label: 'Someone uses an AI tool privately, but nothing is part of the process', score: 1, hours: 0 },
      { label: 'We have automated one or two things, and they mostly hold', score: 2, hours: 0 },
      { label: 'Automation is part of how we work, and we monitor it', score: 3, hours: 0 },
    ],
  },
];

/* ------------------------------------------------------------------
   Opportunities. Each maps a weak answer onto something Praxis builds,
   with the service it belongs to so the result screen can link through.
------------------------------------------------------------------- */
export const OPPORTUNITIES = {
  'lead-capture': {
    title: 'Capture every enquiry into one place, automatically',
    service: 'Lead automation',
    slug: 'lead-automation',
    body: 'Enquiries from WhatsApp, your forms, email and calls land in one queue as they arrive, de-duplicated and timestamped. Nobody retypes anything, and the ones nobody answered become visible.',
  },
  'lead-followup': {
    title: 'Make follow-up a system rather than a memory',
    service: 'Lead automation',
    slug: 'lead-automation',
    body: 'Each enquiry gets an owner and a clock. If nothing has happened by the window you set, it escalates on its own. Leads then go cold for reasons you chose rather than reasons you did not see.',
  },
  invoicing: {
    title: 'Turn accepted quotes into invoices without retyping',
    service: 'Accounting and finance automation',
    slug: 'accounting-automation',
    body: 'One record moves from quote to invoice to ledger entry. The figures are entered once, which removes both the time and the transcription errors that are expensive to find later.',
  },
  'document-capture': {
    title: 'Read supplier invoices and receipts on arrival',
    service: 'Accounting and finance automation',
    slug: 'accounting-automation',
    body: 'Supplier, total, VAT, due date and line items are extracted as documents arrive and posted to your books. Anything the extraction is not confident about goes to a review queue instead of being guessed.',
  },
  'payment-chasing': {
    title: 'Let overdue reminders send themselves',
    service: 'Accounting and finance automation',
    slug: 'accounting-automation',
    body: 'Reminders go out on the schedule you set and stop the moment a payment clears. Chasing stops depending on somebody being free on the right day.',
  },
  integration: {
    title: 'Connect the systems you already pay for',
    service: 'Reporting and dashboards',
    slug: 'reporting',
    body: 'The highest-value automation in most businesses is not new software. It is removing the person who currently carries data between the software you already have.',
  },
  reporting: {
    title: 'Assemble the weekly numbers once, then never again',
    service: 'Reporting and dashboards',
    slug: 'reporting',
    body: 'One definition per figure, one source per definition, and a page that refreshes on its own. The gap between something changing and you knowing about it is usually where the money is.',
  },
  'customer-comms': {
    title: 'Answer the repeated questions before they are asked',
    service: 'Custom AI workflows',
    slug: 'ai-workflows',
    body: 'The five explanations your team writes out every week become drafted replies, from your own material, for a person to check and send. The judgement stays human; the typing does not.',
  },
  process: {
    title: 'Take the most-repeated task off people entirely',
    service: 'Custom AI workflows',
    slug: 'ai-workflows',
    body: 'The task your team does most often, in the same order every time, is the one worth automating first. It is also the one where the saving is easiest to measure afterwards.',
  },
  'people-admin': {
    title: 'Automate the internal admin around your team',
    service: 'Custom AI workflows',
    slug: 'ai-workflows',
    body: 'Timesheets, leave requests, scheduling and payroll preparation are structured, repetitive and rule-based, which makes them unusually good candidates and unusually dull work for a person.',
  },
  content: {
    title: 'Plan and schedule the marketing instead of improvising it',
    service: 'Lead automation',
    slug: 'lead-automation',
    body: 'Scheduling ahead costs less time than posting in gaps, and it produces something the reporting can actually measure against enquiries received.',
  },
  capacity: {
    title: 'Remove the admin ceiling before you hit it',
    service: 'Reporting and dashboards',
    slug: 'reporting',
    body: 'When the paperwork breaks before the delivery does, more work makes the business worse. That ceiling is nearly always automatable, and cheaper to raise than to hire around.',
  },
  'ai-workflow': {
    title: 'Start with one AI workflow that has a person in the loop',
    service: 'Custom AI workflows',
    slug: 'ai-workflows',
    body: 'One well-chosen workflow, with a confidence threshold and a review queue, is worth more than a broad tool nobody has folded into the process. It also teaches the business what to ask for next.',
  },
};
