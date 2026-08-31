# Praxis — marketing site

Five-page marketing site for Praxis, an automation studio in Eswatini.
React, Vite, Tailwind v4, React Router. Mobile-first, no backend.

```bash
npm install
npm run dev        # development
npm run build      # production build into dist/
npm run preview    # serve the build
```

## Pages

| Route | What it is |
|---|---|
| `/` | Scroll-scrubbed hero, the problem, services, the workflow diagram, worked-example proof, audit CTA |
| `/services` | Four services, each with a before and after, a stated limit, and what it is built on |
| `/how-it-works` | The six-stage workflow as an animated diagram, then each stage in full, then the engagement |
| `/audit` | The 16-question diagnostic, its result screen, and the WhatsApp quote handoff |
| `/about` | Philosophy, mission, vision, the five values, commitments, and contact |
| anything else | A 404 built to the same grid — §32 says that page is where consistency is actually tested |

## Structure

```
src/
  index.css              design tokens, type scale, structural utilities
  App.jsx                routes
  components/
    ui.jsx               Logo, Reveal, buttons, SectionHead, LineItem
    Layout.jsx           header with the persistent audit button, oxblood footer band
    ScrollHero.jsx       the canvas frame scrub
    PraxisMark.jsx       GENERATED — the outlined wordmark and icon
    Backdrop.jsx         the procedural section backdrops
    PipelineDiagram.jsx  the six-stage workflow diagram
    PageHeader.jsx       inner-page opening block
    CTABand.jsx          the section CTA, used on every page
  lib/
    contact.js           email, WhatsApp, and every pre-filled message
    services.js          the four services and their before/after content
    pipeline.js          the six stages
    useLenis.js          smooth scroll, on GSAP's ticker
    useReveal.js         scroll reveals
  audit/
    questions.js         the 16 questions, weights, hour estimates
    scoring.js           score, band, recoverable hours, ranked opportunities
tools/
  hero-frame.html        the hero animation, as a deterministic renderFrame(t)
  build-hero-frames.mjs  renders it, encodes an MP4, extracts the WebP sequence
  build-logo.py          outlines the wordmark and writes the whole brand set
  _raster.mjs            SVG to PNG, used by build-logo.py
  verify.mjs             drives the built site in Chromium and checks it
  score-check.mjs        prints the audit result for five answer profiles
public/
  hero-frames/           150 WebP frames, 0.7 MB total
  hero-source.mp4        the source video the frames were extracted from
  fonts/                 Instrument Serif and Inter, self-hosted
  brand/                 the logo export set, generated
  favicon.ico            16, 32, 48 — three distinct masters, per §30
  favicon.svg            the 64px master
  apple-touch-icon.png   180px
```

## Changing things

**Contact details** live in `src/lib/contact.js` and nowhere else. That file
also holds every pre-filled WhatsApp message.

> The brief gave the email address twice, once as `praxis.digitals.gmail.com`
> — which has no `@` and so is not a valid address — and once as
> `praxis.digital.sz@gmail.com`. The second is used throughout. If the first
> was intended, change `EMAIL` in that file.

**Design tokens** live at the top of `src/index.css`. Change them there, not
at call sites. Deviations from the brand guidelines are recorded with their
reasons in `DEVIATIONS.md`.

**Audit questions** live in `src/audit/questions.js`. Scoring reads only
`score`, `hours`, `weight`, `scale` and `opportunity`, so the wording of a
question or an option can be rewritten without touching `scoring.js`. Run
`node tools/score-check.mjs` after any change — it prints the score, band,
recoverable hours and opportunity count for five answer profiles, which is
the fastest way to see whether a weight change did what you meant.

## The audit

Sixteen questions across the ten categories the brief named: Foundation,
Digital Presence, Brand & Identity, Marketing, Payments & Finance, Operations,
Customer Experience, Team & HR, Technology & Data, and Growth & Strategy, plus
the AI and automation readiness question.

**The source quiz was not supplied.** The brief referred to an existing
15-question KQR quiz, "Is your business ready to scale?", but that file did not
come with it, so all sixteen questions are written fresh against the named
categories. If the original turns up, its wording can be dropped into
`questions.js` without changing anything else.

Eight of the sixteen exist to detect repetitive manual work and carry the
heaviest weights, since that is what Praxis sells against. The remaining eight
establish whether the foundations exist to sustain an automation once it is
built.

The result gives a readiness score out of 100, a band, the three
highest-impact opportunities for those specific answers, and an estimate of
recoverable hours per month. The hours model assumes automation removes about
55% of the time a task currently takes and discounts the overlap between
questions; both assumptions are stated on the result screen rather than hidden.

**Nothing is stored.** Answers live in component state. There is no backend, no
storage, no analytics and no request. The only thing that leaves the browser is
the WhatsApp message the reader composes at the end, and only when they send it.

## The scroll-driven hero

Built with the video-to-website technique: a video is decomposed into a WebP
frame sequence, the sequence is drawn to a canvas, and scroll position selects
the frame. Lenis smooth scroll and GSAP ScrollTrigger, with Lenis driven off
GSAP's ticker so both run on one clock.

Two deliberate departures from that skill's default build. The canvas is
scoped to the hero rather than pinned behind the whole document — the brief
asks for lightweight reveals below the fold, and a page-length canvas keeps a
decoded frame buffer alive for the whole session on a phone. And the sequence
sits behind the copy at low opacity under a scrim, because it is a background
rather than the subject.

### The hero source video

**The clip in `public/hero-source.mp4` was rendered procedurally, not
generated by an AI model.** The brief asked for a 4–6 second abstract loop from
Kling, Seedance or Gemini 3 Flash. That was not possible in the build
environment: the Higgsfield account had 1 credit on the free plan against a
12.5-credit minimum for the cheapest 5-second clip, free-trial unlimited
generations were unavailable, and there were no Kie / fal.ai / WaveSpeed /
Google API keys configured.

Rather than ship a placeholder, the source clip is rendered from
`tools/hero-frame.html`, which draws a deterministic five-second sequence:
a scattered field of task marks is drawn into a six-stage pipeline and resolves
into a ruled ledger closed by the double rule from the logo. See `DEVIATIONS.md`
§4 for why this also happens to sit better with §16 and §17 than the usual
output of that brief would.

**To swap in a generated clip**, no code changes are needed:

```bash
node tools/build-hero-frames.mjs --video /path/to/your-clip.mp4
```

That re-extracts the WebP sequence and rewrites `src/hero-frames.json`, which
is where the frame count comes from. The procedural render also goes through
the MP4 encode step precisely so both paths are identical — nothing downstream
can tell the difference.

To re-render the procedural clip instead, run it with no arguments. Edit the
scene geometry at the top of `tools/hero-frame.html`.

## Verification

```bash
npm run build
npx vite preview --port 4173 &
BASE=http://localhost:4173 node tools/verify.mjs
```

Screenshots every page at 1440×900 and 390×844, scrubs the hero, walks all
sixteen audit questions on both widths, checks the back button retains an
answer, submits the quote form empty and then filled, asserts the WhatsApp
href, and fails on any console error or horizontal overflow.

## Accessibility

Skip link, focus moved to the question heading on each audit advance, the
option list as a real radiogroup, keyboard shortcuts (1–4 to answer, arrows to
move), labelled progressbar, form errors tied to fields with `aria-describedby`,
and `prefers-reduced-motion` honoured throughout — it disables smooth scroll,
renders the hero as a still and stops the diagram's travelling packet.

Contrast: `quiet` on charcoal is 7.3:1, `ember` on charcoal 4.6:1, warm white
on charcoal 15.8:1.

## The logo

`tools/build-logo.py` is the source of truth for the mark. It outlines the
Instrument Serif glyphs, lays the two rules against the cap height using the
§07 ratios, and writes:

- the five §08 colourways into `public/brand/`, named per §34
- the §30 icon masters at 512, 180, 64, 48, 32, 24 and 16px, each drawn
  separately with the optical weight correction from that table (+4% at 32px,
  +6% at 24, +8% at 16) rather than scaled down from the largest
- `favicon.ico` bundling three distinct masters, `favicon.svg`, and
  `apple-touch-icon.png`
- `src/components/PraxisMark.jsx`, which the site imports

Do not edit `PraxisMark.jsx` by hand. Run:

```bash
pip install fonttools brotli pillow
python3 tools/build-logo.py
```

§10 sets the screen minimum at 90px wide, below which the two rules merge and
a single rule reads as an unverified subtotal. `Logo` will not render smaller
than that, and `LogoResponsive` falls back to the icon in narrow spaces —
which is why the header shows the wordmark from 640px up and the icon tile
below it.

## Outstanding — to supply before launch

- A designer's logo master, if one exists. The current files are constructed
  from the §07 specification and are faithful to it, but they were derived
  rather than drawn; see `DEVIATIONS.md` §7.
- Real proof. The home page's worked example is explicitly labelled as modelled
  figures for a ten-person business. No client names, testimonials or results
  appear anywhere, because none were supplied.
- Confirmation of the email address (see above).
- Team, history and any accreditations for the About page, if wanted.
- Confirmation of the stated working hours and the service timelines in
  `src/lib/services.js`, which are placeholders in the right shape.
- A decision on the AI-generated hero clip. The procedural one ships now; see
  "The hero source video" above for the one command that swaps it.
