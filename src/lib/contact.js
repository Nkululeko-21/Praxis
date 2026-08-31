/* ------------------------------------------------------------------
   The single source of truth for how to reach Praxis.

   Note on the address: the brief gave it twice, once as
   "praxis.digitals.gmail.com" (no @, so not a valid address) and once
   as "praxis.digital.sz@gmail.com". The second is used throughout.
   If the first was the intended one, change EMAIL here and nowhere else.
------------------------------------------------------------------- */

export const EMAIL = 'praxis.digital.sz@gmail.com';

/** Display form, as it should be written on the page. */
export const WHATSAPP_DISPLAY = '+268 7888 4993';

/** Dial form for wa.me — country code, digits only, no plus. */
export const WHATSAPP_E164 = '26878884993';

export const LOCATION = 'Eswatini';

/**
 * A click-to-chat link with the message already written.
 * wa.me opens the app on mobile and web.whatsapp.com on desktop.
 */
export function whatsappLink(message) {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoLink(subject, body) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const q = params.toString();
  return `mailto:${EMAIL}${q ? `?${q}` : ''}`;
}

/* Pre-filled openers. Plain and specific, per §24 — no urgency, no
   superlatives, and each one says what the sender actually wants. */
export const MESSAGES = {
  general:
    "Hello Praxis. I'd like to talk about automating some of the repetitive work in my business.",
  audit:
    "Hello Praxis. I'd like to book the free automation audit.",
  services: (pillar) =>
    `Hello Praxis. I'd like to talk about ${pillar}.`,
};

/**
 * The message the audit result screen hands to WhatsApp.
 * Everything the reader answered stays in the browser; only this summary
 * travels, and only when they choose to send it.
 */
export function quoteMessage({ name, business, phone, score, band, hours, opportunities }) {
  const lines = [
    'Hello Praxis. I completed the automation audit and would like a quote.',
    '',
    `Name: ${name}`,
    `Business: ${business}`,
    `Reply on: ${phone}`,
    `Automation readiness score: ${score}/100 (${band})`,
    `Estimated recoverable time: about ${hours} hours a month`,
    '',
    'Highest-impact opportunities:',
    ...opportunities.map((o, i) => `${i + 1}. ${o.title}`),
  ];
  return lines.join('\n');
}
