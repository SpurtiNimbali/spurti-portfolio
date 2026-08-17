import { lazy, Suspense, useEffect, useState } from "react";

const LiquidCanvas = lazy(() =>
  import("./LiquidCanvas").then((m) => ({ default: m.LiquidCanvas })),
);

/**
 * The CSS paper wash underneath this is the permanent fallback, so the canvas is
 * purely additive: it only mounts after hydration, and only when the browser can
 * actually run it and the visitor hasn't asked for less motion.
 */
function canRenderCanvas() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export function WebGLBackdrop() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(canRenderCanvas());
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <LiquidCanvas />
    </Suspense>
  );
}
