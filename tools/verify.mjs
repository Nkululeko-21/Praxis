#!/usr/bin/env node
/* Drives the built site in Chromium: screenshots every page at desktop
   and phone widths, walks the whole audit, and reports console errors. */

import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = process.env.OUT || '/tmp/praxis-shots';
mkdirSync(OUT, { recursive: true });

function chromiumPath() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const dir = readdirSync(base).filter((d) => d.startsWith('chromium-')).sort().pop();
  const p = join(base, dir, 'chrome-linux', 'chrome');
  return existsSync(p) ? p : undefined;
}

const problems = [];

async function page(ctx, label) {
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[${label}] console: ${m.text()}`);
  });
  p.on('pageerror', (e) => problems.push(`[${label}] pageerror: ${e.message}`));
  return p;
}

const browser = await chromium.launch({ executablePath: chromiumPath() });

for (const [device, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['phone', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: device === 'phone',
    hasTouch: device === 'phone',
  });

  for (const [name, path] of [
    ['home', '/'],
    ['services', '/services'],
    ['how-it-works', '/how-it-works'],
    ['audit', '/audit'],
    ['about', '/about'],
    ['404', '/nope'],
  ]) {
    const p = await page(ctx, `${device} ${name}`);
    await p.goto(BASE + path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    await p.screenshot({ path: join(OUT, `${device}-${name}.png`) });

    /* horizontal overflow is the classic responsive failure */
    const overflow = await p.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) problems.push(`[${device} ${name}] horizontal overflow: ${overflow}px`);

    await p.close();
  }

  /* the hero, scrubbed part-way through */
  if (device === 'desktop') {
    const p = await page(ctx, 'hero scrub');
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    await p.evaluate(() => window.scrollTo(0, window.innerHeight * 1.4));
    await p.waitForTimeout(1400);
    await p.screenshot({ path: join(OUT, 'hero-scrubbed.png') });
    await p.evaluate(() => window.scrollTo(0, window.innerHeight * 3.2));
    await p.waitForTimeout(1400);
    await p.screenshot({ path: join(OUT, 'home-problem.png') });
    await p.close();
  }

  await ctx.close();
}

/* ---- walk the audit end to end ---------------------------------- */
for (const [device, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['phone', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport, isMobile: device === 'phone', hasTouch: device === 'phone' });
  const p = await page(ctx, `${device} audit-walk`);
  await p.goto(BASE + '/audit', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: 'Start the audit' }).click();
  await p.waitForTimeout(400);

  await p.screenshot({ path: join(OUT, `${device}-audit-q1.png`) });

  /* answer every question with the most-manual option, which is the
     case the result screen has the most to say about */
  for (let i = 0; i < 16; i++) {
    const options = p.getByRole('radio');
    await options.first().waitFor({ state: 'visible' });
    const n = await options.count();
    if (n < 2) { problems.push(`[${device}] question ${i + 1} rendered ${n} options`); break; }
    if (i === 5) await p.screenshot({ path: join(OUT, `${device}-audit-q6.png`) });
    await options.nth(0).click();
    await p.waitForTimeout(420);
  }

  await p.waitForTimeout(900);
  const heading = await p.getByText('Automation readiness').count();
  if (!heading) problems.push(`[${device}] audit did not reach the result screen`);
  await p.screenshot({ path: join(OUT, `${device}-audit-result.png`), fullPage: device === 'phone' });

  const score = await p.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find(
      (s) => /^\d{1,3}$/.test(s.textContent.trim()) && parseInt(s.style.fontSize) > 60,
    );
    return el ? el.textContent.trim() : null;
  });
  console.log(`${device}: all-manual score = ${score}`);

  /* the quote form: submit empty, then filled */
  await p.getByRole('button', { name: 'Get a free quote' }).scrollIntoViewIfNeeded();
  await p.getByRole('button', { name: 'Get a free quote' }).click();
  await p.waitForTimeout(300);
  const errs = await p.getByText('We need a name to address the reply to.').count();
  if (!errs) problems.push(`[${device}] empty quote form did not show validation errors`);
  await p.screenshot({ path: join(OUT, `${device}-quote-errors.png`) });

  await p.locator('#quote-name').fill('Thandi Dlamini');
  await p.locator('#quote-business').fill('Lobamba Hardware');
  await p.locator('#quote-phone').fill('+268 7612 3456');
  await p.getByRole('button', { name: 'Get a free quote' }).click();
  await p.waitForTimeout(400);

  const wa = await p.getByRole('link', { name: 'Open WhatsApp with your result' }).getAttribute('href');
  if (!wa || !wa.startsWith('https://wa.me/26878884993?text=')) {
    problems.push(`[${device}] WhatsApp handoff href wrong: ${wa}`);
  } else if (device === 'desktop') {
    console.log('\nWhatsApp message:\n' + decodeURIComponent(wa.split('text=')[1]));
  }
  await p.screenshot({ path: join(OUT, `${device}-quote-ready.png`) });

  /* back button must return to question 16 with the answer intact */
  await p.close();
  await ctx.close();
}

/* ---- the back button, specifically ------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await page(ctx, 'back-button');
  await p.goto(BASE + '/audit', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: 'Start the audit' }).click();
  await p.waitForTimeout(300);
  await p.getByRole('radio').nth(1).click();
  await p.waitForTimeout(500);
  await p.getByRole('radio').nth(2).click();
  await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Back' }).click();
  await p.waitForTimeout(300);
  const checked = await p.getByRole('radio', { checked: true }).count();
  if (checked !== 1) problems.push(`back button: expected 1 retained answer, found ${checked}`);
  const label = await p.locator('h1').first().textContent();
  console.log(`back button lands on: "${label.slice(0, 50)}..." with ${checked} answer retained`);
  await p.close();
  await ctx.close();
}

await browser.close();

console.log('\n' + '='.repeat(60));
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((x) => console.log('  - ' + x));
  process.exitCode = 1;
} else {
  console.log('No console errors, no overflow, audit completes on both widths.');
}
console.log(`Screenshots in ${OUT}`);
