#!/usr/bin/env python3
"""Turn a photo into a sticker-ready cutout: knock out the background, trim to
the subject, and cap the longest edge.

The white contour and coloured rim are drawn at runtime by CSS (see .sticker__img
in index.css) so they stay crisp at any size — this script only produces a clean
alpha channel.

    python3 tools/make-sticker.py in.jpg src/assets/sticker-simba.png

Campus photos that sit in polaroid / tape / torn / ink frames are cropped
rectangles, not cutouts. Add those to PRINTS in src/lib/stickers.ts
and do not run rembg on them.
"""

import sys
from io import BytesIO

from PIL import Image, ImageFilter
from rembg import remove

MAX_EDGE = 900
FEATHER = 0.6
PAD = 8


def main(src: str, dst: str) -> None:
    raw = Image.open(src).convert("RGBA")

    cut = remove(raw)
    if not isinstance(cut, Image.Image):
        cut = Image.open(BytesIO(cut))
    cut = cut.convert("RGBA")

    # Drop near-transparent fringe pixels, which otherwise smear the contour.
    alpha = cut.getchannel("A").point(lambda v: 0 if v < 26 else v)
    alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))
    cut.putalpha(alpha)

    box = cut.getchannel("A").getbbox()
    if box:
        left, top, right, bottom = box
        left, top = max(0, left - PAD), max(0, top - PAD)
        right, bottom = min(cut.width, right + PAD), min(cut.height, bottom + PAD)
        cut = cut.crop((left, top, right, bottom))

    if max(cut.size) > MAX_EDGE:
        scale = MAX_EDGE / max(cut.size)
        cut = cut.resize((round(cut.width * scale), round(cut.height * scale)), Image.LANCZOS)

    cut.save(dst, optimize=True)
    covered = sum(1 for v in cut.getchannel("A").getdata() if v > 8)
    print(f"{dst} {cut.size} subject covers {100 * covered / (cut.width * cut.height):.0f}% of the box")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
