import { useEffect, useRef } from "react";

const GRID = 16;
const BANDS = 14;
const POINTER_LERP = 0.05;
const MAX_SHIFT_PX = 2;
const MIN_TESS_DELTA = 0.5;
const IDLE_MS = 3000;
const PEAK_RADIUS = 400;
const FEATHER_PX = 120;
const INDEX_EVERY = 5;
const INDEX_ALPHA = 0.06;
const INDEX_WIDTH = 1.25;
const GRAD_SKIP = 0.018;
const MIN_BOUNDARY_PX = 24;

const PAPER_L = 0.955;
const BAND_DL = 0.0014;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchPrimary() {
  return window.matchMedia("(hover: none)").matches;
}

type Rect = { left: number; top: number; right: number; bottom: number };

function maskAt(x: number, y: number, rects: Rect[]) {
  let m = 1;
  for (const r of rects) {
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return 0;
    const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
    const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
    const dist = Math.hypot(dx, dy);
    if (dist < FEATHER_PX) m = Math.min(m, dist / FEATHER_PX);
  }
  return m;
}

function readMaskRects(): Rect[] {
  const rects: Rect[] = [];
  for (const sel of [".hero-line", ".meta-left", ".meta-right"]) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    rects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  }
  return rects;
}

function bandColor(band: number, alpha: number) {
  const L = PAPER_L - band * BAND_DL;
  return `oklch(${L.toFixed(4)} 0.014 88 / ${alpha.toFixed(3)})`;
}

export function ContourCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const staticMode = prefersReducedMotion() || isTouchPrimary();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: 0 };
    const lastTess = { x: -9999, y: -9999 };
    let lastMove = performance.now();
    let raf = 0;
    let w = 0;
    let h = 0;
    let lobes: { cx: number; cy: number; sigma: number; amp: number }[] = [];

    const dprCap = () => Math.min(2, window.devicePixelRatio || 1);

    const rebuildLobes = () => {
      lobes = [
        { cx: w * 0.22, cy: h * 0.28, sigma: w * 0.48, amp: 0.55 },
        { cx: w * 0.72, cy: h * 0.42, sigma: w * 0.62, amp: 0.5 },
        { cx: w * 0.38, cy: h * 0.72, sigma: w * 0.44, amp: 0.45 },
      ];
    };

    const resize = () => {
      const dpr = dprCap();
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildLobes();
      lastTess.x = -9999;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        schedule();
      }, 120);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (staticMode) return;
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      lastMove = performance.now();
      schedule();
    };

    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
      lastMove = performance.now();
      schedule();
    };

    const sampleField = (x: number, y: number, strength: number) => {
      let v = 0;
      for (const l of lobes) {
        const dx = x - l.cx;
        const dy = y - l.cy;
        v += l.amp * Math.exp(-(dx * dx + dy * dy) / (2 * l.sigma * l.sigma));
      }
      if (strength > 0.001) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d2 = dx * dx + dy * dy;
        const r2 = PEAK_RADIUS * PEAK_RADIUS;
        if (d2 < r2) {
          const t = 1 - d2 / r2;
          v += strength * t * t * 0.35;
        }
      }
      return v;
    };

    const gradMag = (field: Float32Array, cols: number, rows: number, i: number, j: number) => {
      const idx = j * cols + i;
      const left = i > 0 ? field[idx - 1] : field[idx];
      const right = i < cols - 1 ? field[idx + 1] : field[idx];
      const up = j > 0 ? field[idx - cols] : field[idx];
      const down = j < rows - 1 ? field[idx + cols] : field[idx];
      const gx = (right - left) * 0.5;
      const gy = (down - up) * 0.5;
      return Math.hypot(gx, gy);
    };

    const gmSkip = (field: Float32Array, cols: number, rows: number, i: number, j: number) =>
      gradMag(field, cols, rows, i, j) > GRAD_SKIP;

    const draw = () => {
      if (!w || !h) return false;

      if (!staticMode) {
        const idle = performance.now() - lastMove > IDLE_MS;
        if (idle) {
          pointer.tx = -9999;
          pointer.ty = -9999;
        }

        const prevX = pointer.x;
        const prevY = pointer.y;
        let dx = (pointer.tx - pointer.x) * POINTER_LERP;
        let dy = (pointer.ty - pointer.y) * POINTER_LERP;
        const mag = Math.hypot(dx, dy);
        if (mag > MAX_SHIFT_PX) {
          const s = MAX_SHIFT_PX / mag;
          dx *= s;
          dy *= s;
        }
        pointer.x += dx;
        pointer.y += dy;
        pointer.active += ((pointer.tx > -1000 ? 1 : 0) - pointer.active) * POINTER_LERP;

        const moved = Math.hypot(pointer.x - lastTess.x, pointer.y - lastTess.y);
        const pointerMoved = Math.hypot(pointer.x - prevX, pointer.y - prevY);
        if (
          !staticMode &&
          moved < MIN_TESS_DELTA &&
          pointerMoved < MIN_TESS_DELTA &&
          Math.abs(pointer.active - (pointer.tx > -1000 ? 1 : 0)) < 0.01 &&
          performance.now() - lastMove > IDLE_MS
        ) {
          return false;
        }
      }

      const strength = staticMode ? 0 : pointer.active * 0.85;
      const cols = Math.ceil(w / GRID) + 1;
      const rows = Math.ceil(h / GRID) + 1;
      const field = new Float32Array(cols * rows);

      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const v = sampleField(i * GRID, j * GRID, strength);
          field[j * cols + i] = v;
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
      const span = Math.max(1e-5, max - min);
      const maskRects = readMaskRects();

      ctx.clearRect(0, 0, w, h);

      const bands = new Uint8Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const t = (field[idx] - min) / span;
          bands[idx] = Math.min(BANDS - 1, Math.floor(t * BANDS));
        }
      }

      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const idx = j * cols + i;
          const band = bands[idx];
          const cx = i * GRID + GRID * 0.5;
          const cy = j * GRID + GRID * 0.5;
          const ma = maskAt(cx, cy, maskRects);
          if (ma <= 0) continue;
          ctx.fillStyle = bandColor(band, ma);
          ctx.fillRect(i * GRID, j * GRID, GRID, GRID);
        }
      }

      const drawn: { x: number; y: number }[] = [];
      const tooClose = (x: number, y: number) => {
        for (const p of drawn) {
          if (Math.hypot(p.x - x, p.y - y) < MIN_BOUNDARY_PX) return true;
        }
        return false;
      };

      ctx.lineWidth = INDEX_WIDTH;
      ctx.strokeStyle = `rgba(40, 36, 32, ${INDEX_ALPHA})`;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let boundary = INDEX_EVERY; boundary < BANDS; boundary += INDEX_EVERY) {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const idx = j * cols + i;
            const b = bands[idx];
            if (gmSkip(field, cols, rows, i, j)) continue;

            if (i < cols - 1) {
              const b2 = bands[idx + 1];
              if ((b < boundary && b2 >= boundary) || (b >= boundary && b2 < boundary)) {
                const mx = i * GRID + GRID * 0.5;
                const my = j * GRID + GRID * 0.5;
                const ma = maskAt(mx, my, maskRects);
                if (ma > 0.02 && !tooClose(mx, my)) {
                  ctx.moveTo(mx - GRID * 0.4, my);
                  ctx.lineTo(mx + GRID * 0.4, my);
                  drawn.push({ x: mx, y: my });
                }
              }
            }
            if (j < rows - 1) {
              const b2 = bands[idx + cols];
              if ((b < boundary && b2 >= boundary) || (b >= boundary && b2 < boundary)) {
                const mx = i * GRID + GRID * 0.5;
                const my = j * GRID + GRID * 0.5;
                const ma = maskAt(mx, my, maskRects);
                if (ma > 0.02 && !tooClose(mx, my)) {
                  ctx.moveTo(mx, my - GRID * 0.4);
                  ctx.lineTo(mx, my + GRID * 0.4);
                  drawn.push({ x: mx, y: my });
                }
              }
            }
          }
        }
        ctx.stroke();
      }

      lastTess.x = pointer.x;
      lastTess.y = pointer.y;

      if (staticMode) return false;

      const idle = performance.now() - lastMove > IDLE_MS;
      const moving =
        Math.abs(pointer.x - pointer.tx) > 0.5 ||
        Math.abs(pointer.y - pointer.ty) > 0.5 ||
        pointer.active > 0.02;
      return moving || !idle;
    };

    const tick = () => {
      raf = 0;
      const keepGoing = draw();
      if (keepGoing) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", schedule, { passive: true });
    if (!staticMode) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    tick();

    return () => {
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="contour-canvas" aria-hidden="true" />;
}
