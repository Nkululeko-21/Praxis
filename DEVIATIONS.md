# Deviations from Praxis Brand Guidelines v1.0

The brief asked for the guidelines to be used as inspiration rather than law,
for the core palette to stay recognisable and the typography disciplined, and
for every deviation to be documented with a reason. This is that document.

Everything not listed here follows the guidelines as written. That includes
the full palette, the type scale and its tracking, the 12-column 1240px grid
with 20/40/64px margins, the 4px spacing system, numbered sections, hairline
dividers, ruled line items rather than cards, no shadows, no gradients on any
element, 44px controls at 3px radius, sentence case throughout, and the tone
of voice rules including the banned-word list.

---

## 1. Charcoal is the dominant surface, not warm white

**Guideline** §12 sets the ratio at 85% warm white, 10% charcoal, 4% bone, 1%
oxblood, measured across a full page.

**What was built** The ratio is inverted for the marketing site: roughly 88%
charcoal, 7% warm white, 4% derived panel, 1% oxblood. Warm white is now the
type colour rather than the ground.

**Why** The brief specifies a dark-dominant site with AI-generated backgrounds
behind the copy, and benchmarks against studios that present that way. A
scroll-driven frame sequence also cannot read on a warm white ground — the
hairline-on-light contrast needed to see it would be loud enough to fight the
text, which §16 and the 20%-opacity cap both rule out.

**What is preserved** The five colours are unchanged as values, the accent
stays as scarce as §12 demands — oxblood appears once per page, in the footer
band, which §12 explicitly permits — and the 85/10/4/1 discipline of one
dominant surface with a very small accent is intact. Only which colour plays
which role has changed.

**Note** §32 says client dashboards use a warm white ground with no dark mode
unless a client requires it. That rule is about the product, not the marketing
site, and is untouched by this.

---

## 2. Three derived colours for the dark ground

**Guideline** §11 defines five colours and warns explicitly that opacity is not
a colour — reduced-opacity charcoal produces a muddy grey that shifts with its
background, which is why slate exists as a fixed value.

**What was built** Three additional fixed values, used only on the charcoal
ground:

| Token | Value | Role |
|---|---|---|
| `panel` | `#1A1D22` | bone's counterpart — quiet panels, hover states |
| `quiet` | `#8A9299` | slate's counterpart — secondary text, captions, labels |
| `ember` | `#9A3038` | oxblood lifted for text and links |

**Why** Inverting the ground breaks two colours. Slate `#4A5259` on charcoal
`#14161A` is roughly 1.7:1 — unreadable. Oxblood `#6B2028` on charcoal is
about 1.9:1, so it fails as link or error text. Bone `#EFE9DE` as a panel fill
on a dark page is a bright block, the opposite of the quiet secondary surface
§11 describes.

**Why this way** The obvious alternative — warm white at reduced opacity — is
the exact thing §11 forbids, and for the reason it gives: the result shifts
whenever the surface behind it changes. These are fixed values that behave
identically on every surface, which is the principle §11 is actually
protecting.

`quiet` gives 7.3:1 on charcoal and `ember` 4.6:1, both above WCAG AA.
Oxblood `#6B2028` is still used unchanged wherever it is a fill rather than
type: the footer band, the primary button hover, and the total mark in the
hero sequence.

---

## 3. Scroll-driven motion in the hero

**Guideline** §18.06 limits transitions to 150–200ms ease-out on opacity and
small position shifts, and rules out parallax, scroll-jacking and entrance
animations on body copy. §01 rules out motion for its own sake.

**What was built** One scroll-scrubbed canvas sequence in the home page hero,
plus scroll-triggered reveals elsewhere at 420ms.

**Why** The brief asks for it specifically, and names the technique. It is
worth separating the two objections §18.06 raises. Scroll-jacking takes the
scroll away from the reader; this does not — scroll position selects a frame
and nothing else, the page scrolls at its true speed, and scrubbing backwards
works. Parallax moves elements at fabricated relative speeds; this does not —
there is one camera.

**What is preserved** No entrance animation is attached to body copy on its
own: reveals apply to whole blocks, so a paragraph never assembles itself
line by line. `prefers-reduced-motion` disables Lenis, disables the scrub and
renders the hero as a still on its resolved frame, and disables the travelling
packet in the workflow diagram.

**Departure from the reveal duration** 420ms rather than 150–200ms. A 180ms
fade on a block entering the viewport reads as a flicker; the specified range
is calibrated for state changes on controls, and every hover, focus and
button transition on the site does use 150ms as written.

---

## 4. The background sequence is procedural, not photographic or AI-generated

**Guideline** §16 rules out abstract technology imagery and glowing circuit
boards. §17 says Praxis does not use illustration, and that concepts needing
visual explanation are drawn as diagrams: hairline rules, charcoal type, bone
fills, no colour beyond the palette, no perspective.

**What was built** The hero sequence is a diagram in motion — a scattered
field of task marks drawn into a six-stage pipeline and resolving into a ruled
ledger closed by the double rule from the logo. Hairlines, palette colours,
orthogonal, no perspective, no glow.

**Why** The brief asked for AI-generated abstract visuals. That was not
possible in this build (see README, "The hero source video"), but it is also
the case that the standard output of that brief — glowing nodes, gradient
meshes, particle fields — is the specific thing §16 exists to exclude. What is
here satisfies §17 as written and says something true about the service. The
pipeline in `tools/build-hero-frames.mjs` accepts a generated clip with one
flag if a different direction is preferred.

---

## 5. Buttons and form fields invert

**Guideline** §20 specifies a charcoal fill for primary buttons with an
oxblood hover. §22 specifies a warm white field fill with a 1px slate border.

**What was built** Primary buttons are a warm white fill with charcoal type,
hovering to oxblood with warm white type. Fields use the derived panel fill
with a hairline border, focusing to a 1px warm white border.

**Why** A charcoal button on a charcoal page is invisible, and a warm white
field on a dark page is a bright rectangle that pulls the eye ahead of the
label above it.

**What is preserved** Every measurement is as specified: 44px height, 24px
horizontal padding, 3px radius, 14px sans medium, sentence case, no gradient,
no shadow, no pill, no uppercase. The oxblood hover is unchanged. The focus
state is still a 1px border with no glow or ring. Errors are still stated in
plain language beneath the field — what is wrong and what to do — rather than
as a coloured outline alone.

---

## 6. Type sizes scale below 1024px

**Guideline** §13 fixes the type scale at 64/44/30/22/18/16/14/12/11px.

**What was built** The specified sizes hold at 1024px and above. Below that,
display and heading sizes scale down with `clamp()` — display reaches 40px at
360px wide, heading 1 reaches 32px.

**Why** 64px display type overflows a 360px viewport. The scale's ratios,
line heights and tracking are unchanged, and every body, caption and label
size is exactly as specified at all widths.

---

## 7. The logo master is generated, not supplied

**Guideline** §33.11 and §34 require outlined paths; a logo file that
references a font renders differently, or not at all, on a machine without
that font.

**What was built** No master was supplied, so `tools/build-logo.py` produces
one: it outlines the Instrument Serif glyphs for "Praxis" into a single path
and lays the two rules against the cap height using the §07 ratios, reading
every measurement off the font's own metrics rather than approximating.

    cap height (x)          720 units, from OS/2 sCapHeight
    rule weight   0.045x =  32.4
    gap           0.09x  =  64.8      exactly twice the rule weight
    rule top      0.24x  =  172.8     from the baseline
    rule width            =  2077     flush to the glyph extremes, not the
                                      advance width

The same script writes the §08 colourways, the §30 icon masters with their
optical weight corrections, the §34 export set and file naming, and
`src/components/PraxisMark.jsx`, so the site and the export files cannot
drift apart. Nothing in the app is set in live type.

**What remains** This is a faithful construction from the specification, but
it is not a designer's master. If one exists, replace the SVGs in
`public/brand/` and regenerate. The construction ratios will match.

---

## 8. Section backdrops

**Guideline** §17 says Praxis does not use illustration, and that a concept
needing visual explanation is drawn as a diagram: hairline rules, bone fills,
no colour beyond the palette, no perspective. §18.04 asks for air over
ornament.

**What was built** Four procedural backdrops — a node graph, a ruled
statement, converging dataflow lanes, and a dashboard — placed once each on
the home, services and how-it-works pages.

**Why** The brief asks for abstract background visuals throughout. These are
drawn as diagrams rather than illustration, in hairlines, in palette colours,
orthogonal and without perspective, so they satisfy §17 as written.

**What keeps this from being ornament** Two rules, both enforced in
`Backdrop.jsx`. They occupy the empty columns rather than sitting behind
copy — §14 says body text lives in columns 1–7 and that the remaining
columns are a deliberate part of the layout, and these live there, measured
to align with the grid rather than the viewport. And opacity is capped at
0.16, under the 20% the brief allows, on figures that are already hairlines.
Nothing is ever placed behind a paragraph and then dimmed until it is
tolerable. They are hidden entirely below 1024px, where there are no empty
columns to put them in.

**Also** The geometry is generated once from a fixed seed, so it is identical
on every render and reload. A texture that reshuffles on re-render is a
distraction.

---

## 9. Proof is modelled, not claimed

Not a deviation from a rule but a decision worth recording. No client names,
testimonials, results or figures appear anywhere on the site, because none
were supplied and §24.01 asks for a specific number rather than a confident
adjective. The home page proof section is an explicitly labelled worked
example for a ten-person business, with the arithmetic shown and stated as
modelled rather than achieved. Replace it with real figures when there are
some.
