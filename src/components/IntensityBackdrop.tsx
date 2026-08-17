import type { CSSProperties } from "react";
import { useHoverEffects } from "./HoverEffectsContext";
import { useIntensity } from "./IntensityContext";
import { WebGLBackdrop } from "./WebGLBackdrop";

export function IntensityBackdrop() {
  const { intensity } = useIntensity();
  const { stanfordHover } = useHoverEffects();

  return (
    <div
      className="intensity-backdrop"
      aria-hidden="true"
      style={
        {
          "--intensity": String(intensity),
          "--stanford-tint": stanfordHover ? "1" : "0",
        } as CSSProperties
      }
    >
      <div className="paper-wash" />
      <WebGLBackdrop />
      <div className="grain-overlay" />
    </div>
  );
}
