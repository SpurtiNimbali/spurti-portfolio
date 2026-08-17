import { useEffect, useRef } from "react";
import { useIntensity } from "./IntensityContext";

const LERP = 0.08;
const PEAK_RADIUS = 400;
const IDLE_MS = 3000;
const LINE_OPACITY_MIN = 0.08;
const LINE_OPACITY_MAX = 0.12;
const GRID = 10;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchPrimary() {
  return window.matchMedia("(hover: none)").matches;
}

function baseHeight(x: number, y: number) {
  return (
    Math.sin(x * 0.0041 + y * 0.0033) * 0.5 +
    Math.sin(x * 0.0082 - y * 0.0061) * 0.25 +
    Math.sin(x * 0.0016 + y * 0.0094) * 0.15
  );
}

function peakBump(dx: number, dy: number, strength: number) {
  const d2 = dx * dx + dy * dy;
  const r2 = PEAK_RADIUS * PEAK_RADIUS;
  if (d2 >= r2) return 0;
  const t = 1 - d2 / r2;
  return strength * t * t;
}

const MS_TABLE: number[][] = [
  [],
  [0, 8],
  [0, 4],
  [4, 8],
  [4, 6],
  [0, 2, 4, 6],
  [2, 6],
  [2, 8],
  [0, 2],
  [0, 6],
  [6, 8],
  [0, 4],
  [4, 6],
  [2, 4],
  [2, 8],
  [],
];

export function ContourCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { intensity } = useIntensity();
  const intensityRef = useRef(intensity);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const staticMode = prefersReducedMotion() || isTouchPrimary();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: 0 };
    let lastMove = performance.now();
    let raf = 0;
    let w = 0;
    let h = 0;

    const dprCap = () => Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const dpr = dprCap();
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    const sample = (x: number, y: number, strength: number) => {
      let v = baseHeight(x, y);
      if (strength > 0.001) v += peakBump(x - pointer.x, y - pointer.y, strength);
      return v;
    };

    const lerpEdge = (x: number, y: number, v0: number, v1: number, iso: number, axis: "x" | "y") => {
      const t = (iso - v0) / (v1 - v0 + 1e-6);
      return axis === "x" ? [x + t * GRID, y] : [x, y + t * GRID];
    };

    const draw = () => {
      if (!w || !h) return false;

      const warmth = intensityRef.current / 5;
      const lineAlpha = LINE_OPACITY_MIN + warmth * (LINE_OPACITY_MAX - LINE_OPACITY_MIN);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = `rgba(40, 36, 32, ${lineAlpha.toFixed(3)})`;
      ctx.lineWidth = 1;

      if (!staticMode) {
        const idle = performance.now() - lastMove > IDLE_MS;
        if (idle) {
          pointer.tx = -9999;
          pointer.ty = -9999;
        }
        pointer.x += (pointer.tx - pointer.x) * LERP;
        pointer.y += (pointer.ty - pointer.y) * LERP;
        pointer.active += ((pointer.tx > -1000 ? 1 : 0) - pointer.active) * LERP;
      }

      const strength = staticMode ? 0 : pointer.active * 0.9;
      const cols = Math.ceil(w / GRID) + 1;
      const rows = Math.ceil(h / GRID) + 1;
      const field = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          field[j * cols + i] = sample(i * GRID, j * GRID, strength);
        }
      }

      const isoLevels = 9;
      for (let li = 0; li < isoLevels; li++) {
        const iso = -0.25 + (li / isoLevels) * 0.85;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const x = i * GRID;
            const y = j * GRID;
            const a = field[j * cols + i];
            const b = field[j * cols + i + 1];
            const c = field[(j + 1) * cols + i];
            const d = field[(j + 1) * cols + i + 1];
            let mask = 0;
            if (a >= iso) mask |= 1;
            if (b >= iso) mask |= 2;
            if (d >= iso) mask |= 4;
            if (c >= iso) mask |= 8;
            const edges = MS_TABLE[mask];
            if (!edges?.length) continue;

            const pts: [number, number][] = [];
            if (edges.includes(0)) pts.push(lerpEdge(x, y, a, b, iso, "x") as [number, number]);
            if (edges.includes(2)) pts.push(lerpEdge(x, y, b, d, iso, "y") as [number, number]);
            if (edges.includes(4)) pts.push(lerpEdge(x, y + GRID, c, d, iso, "x") as [number, number]);
            if (edges.includes(6)) pts.push(lerpEdge(x, y, a, c, iso, "y") as [number, number]);
            if (edges.includes(8)) pts.push(lerpEdge(x, y, a, b, iso, "x") as [number, number]);

            for (let k = 0; k + 1 < pts.length; k += 2) {
              ctx.moveTo(pts[k][0], pts[k][1]);
              ctx.lineTo(pts[k + 1][0], pts[k + 1][1]);
            }
          }
        }
        ctx.stroke();
      }

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
    if (!staticMode) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    tick();

    return () => {
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="contour-canvas" aria-hidden="true" />;
}
