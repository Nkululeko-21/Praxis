/* ------------------------------------------------------------------
   What Praxis sells.

   The brief names three pillars and, separately, four core services.
   Both are honoured here: the first three are the pillars, each with a
   full before-and-after, and custom AI workflows is the fourth, built on
   the same six stages rather than sold as a separate discipline.

   Every "after" states a limit as well as a result, per §24.03. A claim
   with no stated boundary is the kind of thing this brand exists not to
   make.
------------------------------------------------------------------- */

export const SERVICES = [
  {
    slug: 'lead-automation',
    index: '01',
    pillar: true,
    title: 'Lead automation',
    oneLine: 'Every enquiry captured, qualified, assigned and followed up without anyone retyping it.',
    lead: 'From 3 weeks',
    summary:
      'Enquiries arrive on WhatsApp, on a form, by email and by phone, and each channel ends up in a different place. Lead automation makes them one queue, scores what is in it, and makes sure nothing sits unanswered because a person was busy.',
    before: {
      label: 'Before',
      lines: [
        'An enquiry arrives on the business WhatsApp.',
        'Someone reads it, when they next open the phone.',
        'The details are typed into a spreadsheet, sometimes.',
        'Follow-up depends on whoever remembers.',
        'The owner asks how many leads came in last month. Nobody knows.',
      ],
    },
    after: {
      label: 'After',
      lines: [
        'The enquiry is captured the moment it lands, from any channel.',
        'Duplicates and test entries are dropped before anyone sees them.',
        'It is scored against the profile that has actually converted before.',
        'An owner is assigned and the acknowledgement goes out in seconds.',
        'Anything unanswered after the agreed window escalates by itself.',
        'The count, the source and the conversion rate are on one page.',
      ],
    },
    limit:
      'This does not write your sales pitch or decide your pricing. It makes sure the conversation starts, and that you can see which ones did not.',
    builtOn: ['WhatsApp Business API or shared inbox', 'Your CRM, or a sheet if you do not have one', 'A scoring rule set we write with you'],
    typical: '3 to 5 weeks',
  },
  {
    slug: 'accounting-automation',
    index: '02',
    pillar: true,
    title: 'Accounting and finance automation',
    oneLine: 'Invoices, receipts, reconciliation and reminders handled as a process rather than a monthly scramble.',
    lead: 'From 4 weeks',
    summary:
      'The finance work in a small business is mostly transcription: reading a document, finding the matching record, and typing one into the other. That is the part a system does better, and the part that costs the most when it is wrong.',
    before: {
      label: 'Before',
      lines: [
        'Supplier invoices arrive as PDFs and photographs in an inbox.',
        'Each one is opened, read, and keyed into the accounting package.',
        'Bank statements are reconciled line by line, by eye.',
        'Overdue invoices are chased when somebody notices them.',
        'VAT is assembled at the deadline from four different places.',
      ],
    },
    after: {
      label: 'After',
      lines: [
        'Invoices are read on arrival — supplier, total, VAT, due date, line items.',
        'Anything the extraction is not confident about is queued for a person.',
        'Payments are matched to the invoices they settle automatically.',
        'Reminders go out on the schedule you set, not when someone remembers.',
        'The unreconciled items are a short list rather than a search.',
      ],
    },
    limit:
      'We do not replace your accountant and we do not file on your behalf. This removes the keying and the chasing so the work that needs judgement gets the time.',
    builtOn: ['Your existing accounting package', 'Document extraction with a confidence threshold', 'A review queue that a person actually owns'],
    typical: '4 to 7 weeks',
  },
  {
    slug: 'reporting',
    index: '03',
    pillar: true,
    title: 'Reporting and dashboards',
    oneLine: 'The numbers you already have, assembled once and readable without opening anything.',
    lead: 'From 2 weeks',
    summary:
      'Most businesses do not have a data problem. They have an assembly problem: the figures exist, in four systems, and putting them next to each other takes long enough that it happens monthly instead of daily.',
    before: {
      label: 'Before',
      lines: [
        'The weekly figures are built by hand in a spreadsheet.',
        'Each one is copied out of a different system.',
        'The report is accurate on the morning it is made, and stale by Wednesday.',
        'Two people produce slightly different versions of the same number.',
        'A question that needs data costs half a day, so it stops being asked.',
      ],
    },
    after: {
      label: 'After',
      lines: [
        'Each figure has one definition and one source, written down.',
        'The dashboard refreshes on a schedule you choose.',
        'Sales, cash position, overdue debtors and pipeline sit on one page.',
        'The weekly summary sends itself, to the people who need it.',
        'When a number looks wrong, the dashboard shows where it came from.',
      ],
    },
    limit:
      'A dashboard does not improve a number. It shortens the time between something changing and you knowing about it, which is usually where the value is.',
    builtOn: ['Your accounting, CRM and sales data', 'A defined metric dictionary', 'Scheduled refresh with failure alerting'],
    typical: '2 to 4 weeks',
  },
  {
    slug: 'ai-workflows',
    index: '04',
    pillar: false,
    title: 'Custom AI workflows',
    oneLine: 'Classification, extraction and drafting, applied to the specific job that is eating your week.',
    lead: 'Scoped per case',
    summary:
      'Where the repetitive work involves reading something and deciding what it is, a model can do the first pass. The engineering is in the parts around it: what happens when it is unsure, and how you find out when it is wrong.',
    before: {
      label: 'Before',
      lines: [
        'Someone reads every incoming document and sorts it by hand.',
        'The same five replies are written out again, slightly differently each time.',
        'Records are matched across two systems by searching for names.',
        'Quality depends entirely on who happened to be doing it that day.',
      ],
    },
    after: {
      label: 'After',
      lines: [
        'Documents are classified and routed on arrival.',
        'Replies are drafted from your own material, for a person to send.',
        'Low-confidence cases go to a human queue rather than being guessed.',
        'Every decision the model made is logged, so it can be audited later.',
      ],
    },
    limit:
      'We will not put a model in front of a customer without a person in the loop, and we will not ship one whose output nobody is checking. Where a rule would do the job, we write the rule instead.',
    builtOn: ['A defined confidence threshold and fallback', 'A human review queue', 'A full decision log from day one'],
    typical: 'Scoped after the audit',
  },
];

export const PILLARS = SERVICES.filter((s) => s.pillar);
