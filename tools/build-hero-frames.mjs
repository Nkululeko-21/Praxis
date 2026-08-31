#!/usr/bin/env node
/* ------------------------------------------------------------------
   Builds the scroll-scrubbed hero asset chain.

     source video  ->  WebP frame sequence  ->  public/hero-frames/

   Two ways in:

   1. No arguments. Renders tools/hero-frame.html deterministically in
      headless Chromium, encodes those frames to public/hero-source.mp4,
      then extracts the WebP sequence from that MP4.

   2. --video <path>. Skips the render and uses your own clip — an
      AI-generated loop from Kling, Seedance or Gemini, for example.
      Everything downstream is identical.

        node tools/build-hero-frames.mjs --video ~/praxis_hero.mp4

   The MP4 step is not decorative. Extracting the sequence from an
   encoded video, rather than straight from the renderer, means the
   procedural clip and a generated clip go through exactly the same
   path, so swapping one for the other changes nothing else.
------------------------------------------------------------------- */

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const FPS         = 30;
const DURATION    = 5;                       // seconds
const FRAME_COUNT = FPS * DURATION;          // 150 frames
const OUT_WIDTH   = 1280;
const WEBP_Q      = 82;

const PNG_DIR    = join(ROOT, '.frame-cache');
const FRAMES_DIR = join(ROOT, 'public', 'hero-frames');
const SOURCE_MP4 = join(ROOT, 'public', 'hero-source.mp4');

/* ---- locate a full ffmpeg ---------------------------------------
   The sandbox ships a stripped ffmpeg with no h264 or webp support,
   so resolve imageio-ffmpeg's static build first and only fall back
   to whatever is on PATH.                                          */
function ffmpegPath() {
  try {
    const p = execFileSync('python3', [
      '-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())',
    ], { encoding: 'utf8' }).trim();
    if (p && existsSync(p)) return p;
  } catch { /* fall through */ }
  return 'ffmpeg';
}

const FFMPEG = ffmpegPath();

/* ---- locate a browser -------------------------------------------
   Prefer the Chromium already on the machine. Playwright's bundled
   revision may not match what is installed, and re-downloading is
   both slow and blocked in some environments.                      */
function chromiumPath() {
  for (const p of [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  ]) {
    if (p && existsSync(p)) return p;
  }
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(base)) {
    const dir = readdirSync(base).filter(d => d.startsWith('chromium-')).sort().pop();
    if (dir) {
      const p = join(base, dir, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  return undefined;   // let Playwright resolve its own download
}

function ffmpeg(args) {
  execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

/* ---- step 1: render the source frames ---------------------------- */
async function renderSource() {
  rmSync(PNG_DIR, { recursive: true, force: true });
  mkdirSync(PNG_DIR, { recursive: true });

  const browser = await chromium.launch({ executablePath: chromiumPath() });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('file://' + join(HERE, 'hero-frame.html'));
  await page.waitForFunction(() => typeof window.renderFrame === 'function');

  for (let i = 0; i < FRAME_COUNT; i++) {
    const t = FRAME_COUNT === 1 ? 0 : i / (FRAME_COUNT - 1);
    const dataUrl = await page.evaluate((tt) => {
      window.renderFrame(tt);
      return document.getElementById('c').toDataURL('image/png');
    }, t);
    const png = Buffer.from(dataUrl.slice('data:image/png;base64,'.length), 'base64');
    writeFileSync(join(PNG_DIR, `f_${String(i + 1).padStart(4, '0')}.png`), png);
    if ((i + 1) % 30 === 0) console.log(`  rendered ${i + 1}/${FRAME_COUNT}`);
  }

  await browser.close();
}

/* ---- step 2: encode the source video ----------------------------- */
function encodeSource() {
  mkdirSync(join(ROOT, 'public'), { recursive: true });
  ffmpeg([
    '-framerate', String(FPS),
    '-i', join(PNG_DIR, 'f_%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-pix_fmt', 'yuv420p',
    SOURCE_MP4,
  ]);
}

/* ---- step 3: video -> WebP sequence (the skill's extraction step) -- */
function extractFrames(videoPath) {
  rmSync(FRAMES_DIR, { recursive: true, force: true });
  mkdirSync(FRAMES_DIR, { recursive: true });
  ffmpeg([
    '-i', videoPath,
    '-vf', `fps=${FPS},scale=${OUT_WIDTH}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', String(WEBP_Q), '-compression_level', '6',
    join(FRAMES_DIR, 'frame_%04d.webp'),
  ]);
}

/* ---- step 4: manifest -------------------------------------------- */
function writeManifest() {
  const files = readdirSync(FRAMES_DIR).filter(f => f.endsWith('.webp')).sort();
  const bytes = files.reduce((n, f) => n + statSync(join(FRAMES_DIR, f)).size, 0);
  writeFileSync(
    join(ROOT, 'src', 'hero-frames.json'),
    JSON.stringify({ count: files.length, width: OUT_WIDTH, fps: FPS, pattern: '/hero-frames/frame_%04d.webp' }, null, 2) + '\n',
  );
  console.log(`\n${files.length} frames, ${(bytes / 1048576).toFixed(1)} MB total`);
}

/* ---- main --------------------------------------------------------- */
const argv = process.argv.slice(2);
const videoArg = argv.indexOf('--video');

if (videoArg !== -1) {
  const supplied = resolve(argv[videoArg + 1] ?? '');
  if (!existsSync(supplied)) {
    console.error(`No such video: ${supplied}`);
    process.exit(1);
  }
  console.log(`Using supplied clip: ${supplied}`);
  extractFrames(supplied);
  writeManifest();
} else {
  console.log(`Rendering ${FRAME_COUNT} frames of the procedural hero...`);
  await renderSource();
  console.log('Encoding public/hero-source.mp4...');
  encodeSource();
  console.log('Extracting the WebP sequence...');
  extractFrames(SOURCE_MP4);
  rmSync(PNG_DIR, { recursive: true, force: true });
  writeManifest();
}
