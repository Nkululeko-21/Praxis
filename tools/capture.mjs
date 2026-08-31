#!/usr/bin/env node
/* Captures a walkthrough of the running site: the pages at desktop width
   at the scroll positions that actually show something, plus the phone
   views. Reveals are scroll-triggered, so every shot scrolls into place
   and waits before capturing rather than screenshotting a cold page. */

import { chromium } from 'playwright';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const OUT = process.env.OUT || '/tmp/praxis-tour';
mkdirSync(OUT, { recursive: true });

function chromiumPath() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const dir = readdirSync(base).filter((d) => d.startsWith('chromium-')).sort().pop();
  const p = join(base, dir, 'chrome-linux', 'chrome');
  return existsSync(p) ? p : undefined;
}

const browser = await chromium.launch({ executablePath: chromiumPath() });

/* ---------- desktop ------------------------------------------------ */
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });

async function shot(page, name, prepare) {
  if (prepare) await prepare(page);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log('  ' + name);
}

const page = await desktop.newPage();

// home
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);                       // let the frames load
await shot(page, '01-home-hero');
await shot(page, '02-home-hero-scrubbed', (p) =>
  p.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6)));
await shot(page, '03-home-problem', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[1].scrollIntoView()));
await shot(page, '04-home-services', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[2].scrollIntoView()));
await shot(page, '05-home-workflow', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[3].scrollIntoView()));
await shot(page, '06-home-proof', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[4].scrollIntoView()));
await shot(page, '07-home-footer', (p) =>
  p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)));

// services
await page.goto(BASE + '/services', { waitUntil: 'networkidle' });
await shot(page, '08-services-top');
await shot(page, '09-services-before-after', (p) =>
  p.evaluate(() => {
    const s = document.getElementById('lead-automation');
    window.scrollTo(0, s.offsetTop + 560);
  }));

// how it works
await page.goto(BASE + '/how-it-works', { waitUntil: 'networkidle' });
await shot(page, '10-how-it-works-top');
await shot(page, '11-how-it-works-diagram', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[1].scrollIntoView()));
await shot(page, '12-how-it-works-stages', (p) =>
  p.evaluate(() => window.scrollBy(0, 900)));

// about
await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
await shot(page, '13-about-top');
await shot(page, '14-about-contact', (p) =>
  p.evaluate(() => document.getElementById('contact').scrollIntoView()));

// the audit, answered as a middling business rather than a worst case
await page.goto(BASE + '/audit', { waitUntil: 'networkidle' });
await shot(page, '15-audit-intro');
await page.getByRole('button', { name: 'Start the audit' }).click();
await page.waitForTimeout(500);
await shot(page, '16-audit-question');

const PROFILE = [1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 2, 1, 1];
for (let i = 0; i < 16; i++) {
  const options = page.getByRole('radio');
  await options.first().waitFor({ state: 'visible' });
  const n = await options.count();
  await options.nth(Math.min(PROFILE[i], n - 1)).click();
  await page.waitForTimeout(420);
}
await page.waitForTimeout(900);
await shot(page, '17-audit-result');
await shot(page, '18-audit-opportunities', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[1].scrollIntoView()));
await shot(page, '19-audit-breakdown', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[2].scrollIntoView()));
await shot(page, '20-audit-quote', (p) =>
  p.evaluate(() => document.querySelectorAll('section')[3].scrollIntoView()));

const score = await page.evaluate(() => {
  const el = [...document.querySelectorAll('span')].find(
    (s) => /^\d{1,3}$/.test(s.textContent.trim()) && parseFloat(s.style.fontSize) > 60,
  );
  return el?.textContent.trim();
});
console.log(`\n  (audit walkthrough scored ${score}/100)`);

await page.close();
await desktop.close();

/* ---------- phone -------------------------------------------------- */
const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const m = await phone.newPage();

await m.goto(BASE + '/', { waitUntil: 'networkidle' });
await m.waitForTimeout(2200);
await shot(m, '21-phone-home');
await shot(m, '22-phone-services', async (p) => {
  await p.goto(BASE + '/services', { waitUntil: 'networkidle' });
});
await m.goto(BASE + '/audit', { waitUntil: 'networkidle' });
await m.getByRole('button', { name: 'Start the audit' }).click();
await m.waitForTimeout(500);
await shot(m, '23-phone-audit-question');
for (let i = 0; i < 16; i++) {
  const options = m.getByRole('radio');
  await options.first().waitFor({ state: 'visible' });
  const n = await options.count();
  await options.nth(Math.min(PROFILE[i], n - 1)).click();
  await m.waitForTimeout(400);
}
await m.waitForTimeout(900);
await shot(m, '24-phone-audit-result');

await browser.close();
console.log(`\nWritten to ${OUT}`);
