#!/usr/bin/env node
/* Renders SVG files to PNG at a given pixel size, through the Chromium
   already installed on the machine. Used by tools/build-logo.py — there is
   no rasteriser in the Python environment and adding cairo just to draw six
   squares is not worth the dependency. */

import { chromium } from 'playwright';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function chromiumPath() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!existsSync(base)) return undefined;
  const dir = readdirSync(base).filter((d) => d.startsWith('chromium-')).sort().pop();
  if (!dir) return undefined;
  const p = join(base, dir, 'chrome-linux', 'chrome');
  return existsSync(p) ? p : undefined;
}

const argv = process.argv.slice(2);
const count = Number(argv[0]);
const jobs = [];
for (let i = 0; i < count; i++) {
  const [svg, png, size] = argv.slice(1 + i * 3, 4 + i * 3);
  jobs.push({ svg, png, size: Number(size) });
}

const browser = await chromium.launch({ executablePath: chromiumPath() });
for (const job of jobs) {
  const svg = readFileSync(job.svg, 'utf8');
  const page = await browser.newPage({
    viewport: { width: job.size, height: job.size },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${job.size}px;height:${job.size}px}</style>${svg}`,
  );
  await page.screenshot({ path: job.png, omitBackground: true });
  await page.close();
  console.log(`  rasterised ${job.png} @ ${job.size}px`);
}
await browser.close();
