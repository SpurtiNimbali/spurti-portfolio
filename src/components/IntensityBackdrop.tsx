import type { CSSProperties } from "react";
import { useHoverEffects } from "./HoverEffectsContext";
import { useIntensity } from "./IntensityContext";

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
      {/* TODO: re-enable ContourCanvas when terrain read is intentional */}
      <div className="grain-overlay" />
    </div>
  );
}
