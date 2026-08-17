import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { PRINTS, printBox, type StickerKey } from "../lib/stickers";

/** A sticker the visitor has peeled off a word. It stays until it is shooed. */
export type Pinned = {
  id: number;
  key: StickerKey;
  /** The word it came from, used to place it nearby. */
  from: DOMRect;
  /** Bumped when the same word is clicked again, which wiggles the sticker. */
  nudge: number;
  /** Index into that entity's `PRINTS` queue. */
  printIndex?: number;
};

/** `w`/`h` is the artwork; `bw`/`bh` is its box once tilted, which is what has
 *  to stay clear of everything else. */
type Spot = { x: number; y: number; w: number; h: number; bw: number; bh: number; tilt: number };
type Box = { left: number; top: number; right: number; bottom: number };

const LEAVE_MS = 420;
const WIGGLE_MS = 520;
const EDGE = 12;
const CLEARANCE = 16;
/** The marks are the page's other clickable objects, so give them a wider berth
 *  than the rest of the furniture — a sticker parked beside one crowds it. */
const NAV_CLEARANCE = 46;
const GRID_STEP = 20;
const COLUMN_COST = 320;

/** Everything a sticker must not cover: the copy, the controls, and the marks. */
const FURNITURE = [".hero-line", ".tone-axis", ".meta", ".nav-row"];

const overlaps = (a: Box, b: Box) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const grow = (b: Box, by: number): Box => ({
  left: b.left - by,
  top: b.top - by,
  right: b.right + by,
  bottom: b.bottom + by,
});

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Where the dismiss control sits: centred, just under the tone control. */
function shooY() {
  const tone = document.querySelector(".tone-axis")?.getBoundingClientRect();
  if (tone && tone.height) return tone.bottom + 24;
  const line = document.querySelector(".hero-line")?.getBoundingClientRect();
  if (line) return line.bottom + 88;
  return window.innerHeight - 72;
}

function blockedBoxes(taken: Spot[]): Box[] {
  const boxes: Box[] = [];

  for (const selector of FURNITURE) {
    for (const el of document.querySelectorAll(selector)) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        boxes.push(grow(r, selector === ".nav-row" ? NAV_CLEARANCE : CLEARANCE));
      }
    }
  }

  // Reserved whether or not the control is on screen yet, so the first sticker
  // does not take the seat the control is about to need.
  const y = shooY();
  const mid = window.innerWidth / 2;
  boxes.push(grow({ left: mid - 92, top: y - 4, right: mid + 92, bottom: y + 34 }, CLEARANCE));

  for (const s of taken) {
    boxes.push(
      grow(
        { left: s.x - s.bw / 2, top: s.y - s.bh / 2, right: s.x + s.bw / 2, bottom: s.y + s.bh / 2 },
        10,
      ),
    );
  }

  return boxes;
}

/**
 * Sweep the viewport for the free position nearest the word it came from. The
 * only space that survives is the page's margins, so stickers scatter down the
 * sides on a wide screen and stack into whatever gap is left on a narrow one —
 * without any per-breakpoint slot table to keep in sync.
 */
function findSpot(from: DOMRect, w: number, h: number, blocked: Box[]) {
  const wx = from.left + from.width / 2;
  const wy = from.top + from.height / 2;
  const column = document.querySelector(".hero-line")?.getBoundingClientRect();
  let best: { x: number; y: number } | null = null;
  let bestScore = Infinity;

  const maxX = window.innerWidth - EDGE - w / 2;
  const maxY = window.innerHeight - EDGE - h / 2;

  for (let x = EDGE + w / 2; x <= maxX; x += GRID_STEP) {
    // The thin bands above and below the copy are technically free, but a
    // sticker there reads as jammed against the page edge. Pay to leave the
    // content column and sit in a proper margin instead.
    const inColumn = column ? x > column.left && x < column.right : false;
    for (let y = EDGE + h / 2; y <= maxY; y += GRID_STEP) {
      const box = { left: x - w / 2, top: y - h / 2, right: x + w / 2, bottom: y + h / 2 };
      if (blocked.some((b) => overlaps(box, b))) continue;
      const score = Math.hypot(x - wx, y - wy) + (inColumn ? COLUMN_COST : 0);
      if (score < bestScore) {
        bestScore = score;
        best = { x, y };
      }
    }
  }

  return best;
}

function pinArt(pin: Pinned) {
  const print = PRINTS[pin.key][pin.printIndex ?? 0];
  const box = printBox(print);
  return { width: box.w, aspect: box.aspect, tilt: print.tilt };
}

function place(pin: Pinned, taken: Spot[]): Spot {
  const art = pinArt(pin);
  const blocked = blockedBoxes(taken);
  // A hand-placed sticker is never perfectly square to the page.
  const tilt = art.tilt + ((pin.id * 41) % 9) - 4;
  const rad = (Math.abs(tilt) * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  const cap = Math.min(art.width, window.innerWidth * 0.42);
  for (const scale of [1, 0.82, 0.66, 0.52]) {
    const w = Math.round(cap * scale);
    const h = Math.round(w * art.aspect);
    // The tilt is what the page sees, so reserve the rotated box, not the art.
    const bw = Math.round(w * cos + h * sin);
    const bh = Math.round(w * sin + h * cos);
    const spot = findSpot(pin.from, bw, bh, blocked);
    if (spot) return { ...spot, w, h, bw, bh, tilt };
  }

  // Nowhere clear at any size: tuck it into the nearest bottom corner and let
  // it overlap rather than drop the interaction.
  const w = Math.round(cap * 0.52);
  const h = Math.round(w * art.aspect);
  const bw = Math.round(w * cos + h * sin);
  const bh = Math.round(w * sin + h * cos);
  const right = pin.from.left > window.innerWidth / 2;
  return {
    x: right ? window.innerWidth - EDGE - bw / 2 : EDGE + bw / 2,
    y: window.innerHeight - EDGE - bh / 2,
    w,
    h,
    bw,
    bh,
    tilt,
  };
}

export function StickerBoard({ pinned, onClear }: { pinned: Pinned[]; onClear: () => void }) {
  const [spots, setSpots] = useState<Record<number, Spot>>({});
  const [leaving, setLeaving] = useState(false);
  const [wiggling, setWiggling] = useState<number[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [shooTop, setShooTop] = useState(0);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const seenNudge = useRef<Record<number, number>>({});

  // Place each new sticker once. Existing ones keep their spot so the board
  // never reshuffles under the visitor — including after a drag.
  useLayoutEffect(() => {
    setSpots((prev) => {
      const live = new Set(pinned.map((p) => p.id));
      const next: Record<number, Spot> = {};
      for (const [id, spot] of Object.entries(prev)) {
        if (live.has(Number(id))) next[Number(id)] = spot;
      }
      for (const pin of pinned) {
        if (next[pin.id]) continue;
        next[pin.id] = place(pin, Object.values(next));
      }
      return next;
    });
  }, [pinned]);

  useLayoutEffect(() => {
    const sync = () => setShooTop(shooY());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [pinned.length]);

  // Keep stickers on screen when the window shrinks under them.
  useEffect(() => {
    const onResize = () =>
      setSpots((prev) => {
        const next: Record<number, Spot> = {};
        for (const [id, s] of Object.entries(prev)) {
          next[Number(id)] = {
            ...s,
            x: clamp(s.x, EDGE + s.bw / 2, Math.max(EDGE + s.bw / 2, window.innerWidth - EDGE - s.bw / 2)),
            y: clamp(s.y, EDGE + s.bh / 2, Math.max(EDGE + s.bh / 2, window.innerHeight - EDGE - s.bh / 2)),
          };
        }
        return next;
      });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const again = pinned.filter((p) => p.nudge > (seenNudge.current[p.id] ?? 0));
    if (!again.length) return;
    for (const p of again) seenNudge.current[p.id] = p.nudge;
    const ids = again.map((p) => p.id);
    setWiggling((w) => [...new Set([...w, ...ids])]);
    const timer = setTimeout(() => setWiggling((w) => w.filter((id) => !ids.includes(id))), WIGGLE_MS);
    return () => clearTimeout(timer);
  }, [pinned]);

  const shoo = useCallback(() => {
    if (reduceMotion()) {
      onClear();
      return;
    }
    setLeaving(true);
    setTimeout(() => {
      setLeaving(false);
      onClear();
    }, LEAVE_MS + pinned.length * 60);
  }, [onClear, pinned.length]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    const spot = spots[id];
    if (!spot || leaving) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, dx: e.clientX - spot.x, dy: e.clientY - spot.y };
    setDragging(id);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    setSpots((prev) => {
      const s = prev[d.id];
      if (!s) return prev;
      return {
        ...prev,
        [d.id]: {
          ...s,
          x: clamp(e.clientX - d.dx, s.bw / 2, window.innerWidth - s.bw / 2),
          y: clamp(e.clientY - d.dy, s.bh / 2, window.innerHeight - s.bh / 2),
        },
      };
    });
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(null);
  };

  if (!pinned.length) return null;

  const named = pinned.some((p) => p.key === "simba") ? "shoo simba" : undefined;

  return createPortal(
    <div className="sticker-layer">
      {pinned.map((pin, i) => {
        const spot = spots[pin.id];
        if (!spot) return null;
        const print = PRINTS[pin.key][pin.printIndex ?? 0];
        const cutout = print.frame === "cutout";
        return (
          <div
            key={pin.id}
            className={cutout ? "sticker" : `sticker sticker--print print print--${print.frame}`}
            aria-hidden="true"
            data-leaving={leaving || undefined}
            data-wiggle={wiggling.includes(pin.id) || undefined}
            data-dragging={dragging === pin.id || undefined}
            onPointerDown={(e) => onPointerDown(e, pin.id)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={
              {
                left: `${spot.x}px`,
                top: `${spot.y}px`,
                width: `${spot.w}px`,
                "--tilt": `${spot.tilt}deg`,
                "--tint": print.tint ?? "transparent",
                "--stagger": `${i * 60}ms`,
              } as CSSProperties
            }
          >
            <img
              className={cutout ? "sticker__img" : "print__photo"}
              src={print.src}
              alt=""
              draggable={false}
            />
          </div>
        );
      })}

      <button
        type="button"
        className="sticker-shoo"
        data-leaving={leaving || undefined}
        onClick={shoo}
        style={{ top: `${shooTop}px` }}
      >
        {named ?? "tidy up"}
      </button>
    </div>,
    document.body,
  );
}

/**
 * The handwritten "github ↗" that trails the swapped handle. The handle itself
 * lives in the sentence so the following words make room; this tag is fixed
 * so it can sit above the line without changing the fit.
 */
export function GitTag({ target }: { target: HTMLElement | null }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }

    const sync = () => setRect(target.getBoundingClientRect());
    sync();
    const frame = requestAnimationFrame(sync);
    const observer = new ResizeObserver(sync);
    observer.observe(target);
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [target]);

  if (!rect) return null;

  return createPortal(
    <div className="sticker-layer" aria-hidden="true">
      <span className="git-tag" style={{ left: `${rect.right}px`, top: `${rect.top}px` }}>
        github
        <svg className="git-tag__arrow" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.6 9.4 9.4 2.6M4.2 2.6h5.2v5.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>,
    document.body,
  );
}
