import { useEffect, useState } from "react";
import { LiquidCanvas } from "./LiquidCanvas";

function canMountField() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function WebGLBackdrop() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(canMountField());
  }, []);

  return (
    <div className="webgl-backdrop" aria-hidden="true">
      <div className="paper-wash" />
      {mount ? <LiquidCanvas /> : null}
      <div className="grain-overlay" />
    </div>
  );
}
