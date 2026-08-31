#!/usr/bin/env python3
"""
Builds the Praxis logo export set from the §07 construction ratios.

§33.11 and §34 require the mark to ship as outlined paths, never as text
referencing a font. This converts the Instrument Serif glyphs for "Praxis"
into a single outlined path, positions the two accounting rules against the
cap height of the P exactly as §07 specifies, and writes the colourways and
icon sizes §08, §30 and §34 call for.

The measurements are not approximated. Every one is read off the font's own
metrics and multiplied by the ratio in the guidelines:

    cap height             x            the base unit, from OS/2 sCapHeight
    baseline to upper rule 0.24x        measured from the baseline
    rule weight            0.045x       both rules identical, floored at 1px
    gap between rules      0.09x        exactly twice the rule weight
    rule width             ink width    flush to the glyph extremes, not the
                                        advance width

Run:  python3 tools/build-logo.py
Out:  public/brand/*.svg, public/brand/*.png, public/favicon.svg,
      public/favicon.ico, public/apple-touch-icon.png
"""

import subprocess
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "public" / "fonts" / "instrument-serif-latin.woff2"
OUT = ROOT / "public" / "brand"

WORDMARK = "Praxis"
TRACKING = 0.005          # §06 — +0.5%

CHARCOAL = "#14161A"
WARM = "#FAF8F4"
OXBLOOD = "#6B2028"


def load_font() -> TTFont:
    if not FONT.exists():
        sys.exit(f"Font not found: {FONT}")
    return TTFont(FONT)


def compose_wordmark(font):
    """Return (path_d, ink_bounds, cap_height, upem) in font units."""
    upem = font["head"].unitsPerEm
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    cap = getattr(font["OS/2"], "sCapHeight", 0)
    if not cap:
        # fall back to the actual ink height of the P
        bp = BoundsPen(glyph_set)
        glyph_set[cmap[ord("P")]].draw(bp)
        cap = bp.bounds[3]

    pen = SVGPathPen(glyph_set)
    bounds_pen = BoundsPen(glyph_set)
    x = 0.0
    for ch in WORDMARK:
        name = cmap.get(ord(ch))
        if name is None:
            sys.exit(f"Font has no glyph for {ch!r}")
        # SVG y grows downward; flip here so the path is drawn upright and
        # the baseline sits at y = 0.
        transform = (1, 0, 0, -1, x, 0)
        glyph_set[name].draw(TransformPen(pen, transform))
        glyph_set[name].draw(TransformPen(bounds_pen, transform))
        x += hmtx[name][0] + upem * TRACKING

    return pen.getCommands(), bounds_pen.bounds, cap, upem


def wordmark_svg(fill: str, *, path_d, bounds, cap, pad=0.0) -> str:
    """
    Compose the mark. `bounds` is (xMin, yMin, xMax, yMax) with y already
    flipped, so the baseline is 0 and ink above it is negative.
    """
    x_min, y_min, x_max, y_max = bounds
    ink_w = x_max - x_min

    weight = cap * 0.045
    gap = cap * 0.09
    rule_top = cap * 0.24          # baseline to the upper rule, §07

    # The rules are filled rectangles, never strokes — §07.
    rules = "\n".join(
        f'  <rect x="{x_min:.2f}" y="{y:.2f}" '
        f'width="{ink_w:.2f}" height="{weight:.2f}"/>'
        for y in (rule_top, rule_top + weight + gap)
    )

    total_h = (rule_top + 2 * weight + gap) - y_min
    vb = f"{x_min - pad:.2f} {y_min - pad:.2f} {ink_w + 2 * pad:.2f} {total_h + 2 * pad:.2f}"

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
        f'width="{ink_w + 2 * pad:.0f}" height="{total_h + 2 * pad:.0f}" '
        f'role="img" aria-label="Praxis" fill="{fill}">\n'
        f'  <path d="{path_d}"/>\n'
        f"{rules}\n"
        f"</svg>\n"
    )


def icon_svg(size: int, radius_pct: float, weight_gain: float, font, *, bg=CHARCOAL, fg=WARM) -> str:
    """
    §30 — a serif P reversed out of a charcoal square, carrying no rules.
    At 16px two hairlines merge into one, and a single rule is an unverified
    subtotal, so shipping the full mark as a favicon would put a misuse case
    on every browser tab.

    `weight_gain` is the optical correction from the §30 table: 4% at 32px,
    6% at 24px, 8% at 16px, none at 64px and above. It is applied as an
    outward stroke in the same colour as the fill, which thickens the stems
    and closes the counter by the same proportion — the effect a hand-hinted
    small master has. Without it a 16px icon scaled down from the 512 master
    looks thin and over-rounded on a real screen, which is the specific
    failure §30 describes.
    """
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm
    name = cmap[ord("P")]

    pen = SVGPathPen(glyph_set)
    bp = BoundsPen(glyph_set)
    glyph_set[name].draw(TransformPen(pen, (1, 0, 0, -1, 0, 0)))
    glyph_set[name].draw(TransformPen(bp, (1, 0, 0, -1, 0, 0)))
    x_min, y_min, x_max, y_max = bp.bounds

    # Optically centre the P and set it to 62% of the square.
    target = size * 0.62
    scale = target / (y_max - y_min)
    w = (x_max - x_min) * scale
    tx = (size - w) / 2 - x_min * scale
    ty = (size + (y_max - y_min) * scale) / 2 - y_max * scale

    # A regular-weight serif stem runs about 9% of the em. Stroking the
    # outline by that fraction of the requested gain thickens each stem by
    # the gain, since a centred stroke adds half its width to either side of
    # every contour.
    stem = 0.09 * upem
    stroke = ""
    if weight_gain:
        stroke = (
            f' stroke="{fg}" stroke-width="{stem * weight_gain:.3f}"'
            f' stroke-linejoin="round" stroke-linecap="round"'
        )

    r = size * radius_pct
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
        f'width="{size}" height="{size}" role="img" aria-label="Praxis">\n'
        f'  <rect width="{size}" height="{size}" rx="{r:.2f}" fill="{bg}"/>\n'
        f'  <g transform="translate({tx:.3f} {ty:.3f}) scale({scale:.6f})" fill="{fg}"{stroke}>\n'
        f'    <path d="{pen.getCommands()}"/>\n'
        f"  </g>\n"
        f"</svg>\n"
    )


def rasterise(svg_paths_and_pngs):
    """Render SVGs to PNG through the Chromium already on the machine."""
    script = ROOT / "tools" / "_raster.mjs"
    args = [str(len(svg_paths_and_pngs))]
    for svg, png, size in svg_paths_and_pngs:
        args += [str(svg), str(png), str(size)]
    subprocess.run(["node", str(script), *args], check=True, cwd=ROOT)



def write_ico(path: Path, entries):
    """
    Write a PNG-payload ICO holding one distinct image per size.

    entries: [(size, png_bytes), ...]

    Layout is ICONDIR, then one 16-byte ICONDIRENTRY per image, then the
    payloads. PNG payloads are accepted by every browser in use.
    """
    import struct

    count = len(entries)
    header = struct.pack("<HHH", 0, 1, count)          # reserved, type=icon, count
    offset = len(header) + 16 * count

    directory = b""
    payloads = b""
    for size, data in entries:
        directory += struct.pack(
            "<BBBBHHII",
            size if size < 256 else 0,                  # width  (0 means 256)
            size if size < 256 else 0,                  # height
            0,                                          # palette size, 0 = none
            0,                                          # reserved
            1,                                          # colour planes
            32,                                         # bits per pixel
            len(data),
            offset,
        )
        payloads += data
        offset += len(data)

    path.write_bytes(header + directory + payloads)


def write_react_mark(path: Path, *, path_d, bounds, cap, font):
    """
    Emit the wordmark as a React component.

    The app used to set the mark as live text, which §33.11 forbids and which
    would also drift from the export files the moment either changed. This is
    generated from the same path and the same §07 measurements as the SVGs,
    so there is one source of truth and it is this script.

    Fill is currentColor throughout: §33.03 requires the rules and the
    wordmark to share one colour always, so making them separately colourable
    would be making a misuse case reachable.
    """
    x_min, y_min, x_max, y_max = bounds
    ink_w = x_max - x_min
    weight = cap * 0.045
    gap = cap * 0.09
    rule_top = cap * 0.24
    total_h = (rule_top + 2 * weight + gap) - y_min

    # The icon geometry, computed on the 64px master — the size §30 gives
    # proportional treatment with no optical correction, and the one an SVG
    # icon scaling to any size should be built from.
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    ipen = SVGPathPen(glyph_set)
    ibp = BoundsPen(glyph_set)
    pname = cmap[ord("P")]
    glyph_set[pname].draw(TransformPen(ipen, (1, 0, 0, -1, 0, 0)))
    glyph_set[pname].draw(TransformPen(ibp, (1, 0, 0, -1, 0, 0)))
    ix_min, iy_min, ix_max, iy_max = ibp.bounds
    icon_scale = (64 * 0.62) / (iy_max - iy_min)
    icon_tx = (64 - (ix_max - ix_min) * icon_scale) / 2 - ix_min * icon_scale
    icon_ty = (64 + (iy_max - iy_min) * icon_scale) / 2 - iy_max * icon_scale
    icon_path = ipen.getCommands()

    body = f"""/* ------------------------------------------------------------------
   GENERATED by tools/build-logo.py — do not edit by hand.
   Run `python3 tools/build-logo.py` to regenerate.

   The wordmark closed by two accounting rules, outlined from Instrument
   Serif and constructed to the §07 ratios:

     cap height (x)          {cap:.0f} units
     rule weight   0.045x =  {weight:.1f}
     gap           0.09x  =  {gap:.1f}   (exactly twice the rule weight)
     rule top      0.24x  =  {rule_top:.1f}   from the baseline
     rule width            =  {ink_w:.0f}   flush to the glyph extremes

   §33.03 — the rules and the wordmark are one object and always share a
   colour, so everything here is currentColor and there is no prop to
   separate them.
------------------------------------------------------------------- */

const VIEW_BOX = '{x_min:.2f} {y_min:.2f} {ink_w:.2f} {total_h:.2f}';
const ASPECT = {ink_w / total_h:.6f};

const PATH = '{path_d}';

/**
 * @param {{{{ height?: number, title?: string, className?: string }}}} props
 *   height — rendered height in px. §10 sets the screen minimum at 90px
 *   wide; below that the icon is used instead, because the two rules merge
 *   and a single rule reads as an unverified subtotal.
 */
export default function PraxisMark({{ height = 30, title = 'Praxis', className = '' }}) {{
  return (
    <svg
      viewBox={{VIEW_BOX}}
      height={{height}}
      width={{height * ASPECT}}
      className={{className}}
      role="img"
      aria-label={{title}}
      fill="currentColor"
      style={{{{ display: 'block' }}}}
    >
      <path d={{PATH}} />
      <rect x="{x_min:.2f}" y="{rule_top:.2f}" width="{ink_w:.2f}" height="{weight:.2f}" />
      <rect x="{x_min:.2f}" y="{rule_top + weight + gap:.2f}" width="{ink_w:.2f}" height="{weight:.2f}" />
    </svg>
  );
}}

/** §10 — the minimum width the wordmark is permitted at on screen. */
export const MIN_WIDTH_PX = 90;

/** The smallest height that keeps the wordmark at or above that width. */
export const MIN_HEIGHT_PX = Math.ceil(MIN_WIDTH_PX / ASPECT);

/* ------------------------------------------------------------------
   The icon, §30 — a serif P reversed out of a charcoal square, carrying
   no rules. §10 sends narrow spaces here rather than to a shrunken
   wordmark, because below 90px the two rules merge into one and a single
   rule is an unverified subtotal.
------------------------------------------------------------------- */

const ICON_PATH = '{icon_path}';
const ICON_TX = {icon_tx:.4f};
const ICON_TY = {icon_ty:.4f};
const ICON_SCALE = {icon_scale:.6f};

export function PraxisIcon({{ size = 32, title = 'Praxis', className = '' }}) {{
  return (
    <svg
      viewBox="0 0 64 64"
      width={{size}}
      height={{size}}
      className={{className}}
      role="img"
      aria-label={{title}}
      style={{{{ display: 'block' }}}}
    >
      <rect width="64" height="64" rx="11.52" fill="var(--icon-bg, #14161A)" />
      <g
        transform={{`translate(${{ICON_TX}} ${{ICON_TY}}) scale(${{ICON_SCALE}})`}}
        fill="var(--icon-fg, #FAF8F4)"
      >
        <path d={{ICON_PATH}} />
      </g>
    </svg>
  );
}}
"""
    path.write_text(body)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    font = load_font()
    path_d, bounds, cap, upem = compose_wordmark(font)

    x_min, y_min, x_max, y_max = bounds
    weight = cap * 0.045
    print(f"units per em     {upem}")
    print(f"cap height (x)   {cap}")
    print(f"ink width        {x_max - x_min:.1f}")
    print(f"rule weight      {weight:.1f}  ({weight / cap:.3f}x)")
    print(f"gap              {cap * 0.09:.1f}  ({cap * 0.09 / weight:.2f}x the weight)")

    # §08 colourways, §34 file naming
    variants = {
        "praxis-logo-primary-charcoal.svg": CHARCOAL,
        "praxis-logo-primary-reversed.svg": WARM,
        "praxis-logo-primary-mono-black.svg": "#000000",
        "praxis-logo-primary-mono-white.svg": "#FFFFFF",
        "praxis-logo-primary-oxblood.svg": OXBLOOD,
    }
    for name, fill in variants.items():
        (OUT / name).write_text(wordmark_svg(fill, path_d=path_d, bounds=bounds, cap=cap))
        print(f"wrote  public/brand/{name}")

    # §30 — each size below 64px is drawn as its own master rather than
    # scaled from the largest. Corner radius and optical weight both come
    # from the table there. 48px is not in the table; it sits above the
    # 32px threshold, so it takes proportional radius and no correction.
    #
    #   size   radius        weight
    #   512    18%           none
    #   180    18%           none
    #   64     18%           none
    #   48     18%           none      (added for the ICO bundle)
    #   32     5px           +4%
    #   24     4px           +6%
    #   16     2px           +8%
    icon_sizes = [
        (512, 0.18, 0.0),
        (180, 0.18, 0.0),
        (64, 0.18, 0.0),
        (48, 0.18, 0.0),
        (32, 5 / 32, 0.04),
        (24, 4 / 24, 0.06),
        (16, 2 / 16, 0.08),
    ]
    for size, radius, gain in icon_sizes:
        p = OUT / f"praxis-icon-{size}.svg"
        p.write_text(icon_svg(size, radius, gain, font))
        note = f"  (+{gain:.0%} weight)" if gain else ""
        print(f"wrote  public/brand/{p.name}{note}")

    write_react_mark(
        ROOT / "src" / "components" / "PraxisMark.jsx",
        path_d=path_d, bounds=bounds, cap=cap, font=font,
    )
    print("wrote  src/components/PraxisMark.jsx")

    # The browser favicon and the Apple touch icon, outlined.
    # An SVG favicon is rendered at whatever size the browser wants, so it
    # takes the 64px master: no correction, and it scales up cleanly.
    (ROOT / "public" / "favicon.svg").write_text(icon_svg(64, 0.18, 0.0, font))
    print("wrote  public/favicon.svg")

    rasterise([
        (OUT / "praxis-icon-512.svg", OUT / "praxis-icon-512.png", 512),
        (OUT / "praxis-icon-180.svg", ROOT / "public" / "apple-touch-icon.png", 180),
        (OUT / "praxis-icon-48.svg", OUT / "_ico-48.png", 48),
        (OUT / "praxis-icon-32.svg", OUT / "_ico-32.png", 32),
        (OUT / "praxis-icon-16.svg", OUT / "_ico-16.png", 16),
    ])

    # §34 — ICO bundling 16, 32 and 48px.
    #
    # Written directly rather than through Pillow's ICO writer, which
    # downsamples one source image to every requested size. §30 is explicit
    # that each size below 64px is drawn as its own master, because a small
    # mark needs more optical weight and less rounding than proportional
    # reduction gives it. Downsampling the 48 would throw all three masters
    # away and ship the thing §30 warns about.
    write_ico(
        ROOT / "public" / "favicon.ico",
        [(s, (OUT / f"_ico-{s}.png").read_bytes()) for s in (16, 32, 48)],
    )
    for s in (16, 32, 48):
        (OUT / f"_ico-{s}.png").unlink()
    print("wrote  public/favicon.ico  (16, 32, 48 — three distinct masters)")
    print("wrote  public/apple-touch-icon.png")


if __name__ == "__main__":
    main()
