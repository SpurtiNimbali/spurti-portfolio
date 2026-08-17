import type { CSSProperties } from "react";
import { useIntensity } from "./IntensityContext";

export function IntensityBackdrop() {
  const { intensity } = useIntensity();

  return (
    <div
      className="intensity-backdrop"
      aria-hidden="true"
      style={{ "--intensity": String(intensity) } as CSSProperties}
    >
      <div className="paper-wash" />
      <div className="grain-overlay" />
    </div>
  );
}
