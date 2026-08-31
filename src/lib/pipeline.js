/* ------------------------------------------------------------------
   The six stages every Praxis workflow is built from.

   This is the actual shape of the systems, not a marketing abstraction:
   a workflow watches for something, discards what it should not act on,
   decides what the thing is, puts it into the shape the destination
   expects, writes it somewhere, and leaves a record. Named once here and
   used by both the home page and the How it works page.
------------------------------------------------------------------- */

export const STAGES = [
  {
    index: '01',
    name: 'Trigger',
    short: 'Something happens, and the workflow notices.',
    detail:
      'A form is submitted, an email lands, a payment clears, a row changes, or the clock reaches 07:00 on a Monday. The trigger is the only part of the workflow that waits — everything after it runs in a few seconds.',
    example: 'A WhatsApp enquiry arrives on the business number.',
    limit: 'A trigger can only see systems it has access to. Anything that lives only in someone\'s head or on paper has to be captured first.',
  },
  {
    index: '02',
    name: 'Filter',
    short: 'Work that should not proceed stops here.',
    detail:
      'Most of what a trigger catches does not need action. The filter drops duplicates, test entries, out-of-hours noise and records that are already handled, so the expensive steps run on real work only.',
    example: 'Discard the enquiry if that number already has an open quote.',
    limit: 'A filter is only as good as its rules. We write them with you and revise them in writing when they turn out to be wrong.',
  },
  {
    index: '03',
    name: 'Intelligence',
    short: 'The workflow decides what it is looking at.',
    detail:
      'Classification, extraction and matching. Reading an invoice PDF and pulling out the supplier, total and VAT. Scoring a lead against the profile that has actually converted before. Matching a payment to the invoice it settles.',
    example: 'Read the enquiry and identify the service, the budget signal and the urgency.',
    limit: 'A model is a judgement, not a fact. Anything it is not confident about is routed to a person rather than guessed.',
  },
  {
    index: '04',
    name: 'Formatter',
    short: 'The data is put into the shape the destination expects.',
    detail:
      'Dates into one format, currency into cents, names into a consistent case, phone numbers into the international form. The unglamorous step that determines whether the next one works.',
    example: 'Normalise the number to +268 format and set the currency to SZL.',
    limit: 'Formatting cannot repair data that was never captured. Missing fields are flagged, not invented.',
  },
  {
    index: '05',
    name: 'Action',
    short: 'The system writes to the place the work actually lives.',
    detail:
      'Create the CRM record, raise the invoice draft, post to the accounting ledger, send the reply, update the sheet, notify the person who owns the next step.',
    example: 'Create the lead, assign an owner, and send the acknowledgement on WhatsApp.',
    limit: 'We prefer to write into the tools you already pay for. Replacing a working system is a separate decision from automating it.',
  },
  {
    index: '06',
    name: 'Output',
    short: 'What happened is recorded, and the record is readable.',
    detail:
      'Every run leaves a line: what came in, what was decided, what was written, and what failed. That log becomes the dashboard, and the dashboard is how you know the automation is still correct six months later.',
    example: 'Append the run to the leads dashboard and the weekly summary.',
    limit: 'An unmonitored automation is a liability. If a workflow cannot report on itself, we do not ship it.',
  },
];
