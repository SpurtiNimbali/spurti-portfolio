import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_INTENSITY,
  INTENSITY_MAX,
  INTENSITY_MIN,
  INTENSITY_LEVELS,
} from "../content";

type IntensityContextValue = {
  intensity: number;
  setIntensity: (value: number) => void;
  label: string;
};

const IntensityContext = createContext<IntensityContextValue | null>(null);

function readIntensityFromUrl(): number | null {
  const raw = new URLSearchParams(window.location.search).get("v");
  if (raw === null) return null;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < INTENSITY_MIN || n > INTENSITY_MAX) return null;
  return n;
}

function writeIntensityToUrl(value: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("v", String(value));
  window.history.replaceState(null, "", url);
}

export function IntensityProvider({ children }: { children: ReactNode }) {
  const [intensity, setIntensityState] = useState(() => readIntensityFromUrl() ?? DEFAULT_INTENSITY);

  const setIntensity = (value: number) => {
    const clamped = Math.min(INTENSITY_MAX, Math.max(INTENSITY_MIN, value));
    setIntensityState(clamped);
    writeIntensityToUrl(clamped);
  };

  useEffect(() => {
    writeIntensityToUrl(intensity);
  }, []);

  const label = INTENSITY_LEVELS[intensity]?.label ?? "confident";

  const value = useMemo(
    () => ({ intensity, setIntensity, label }),
    [intensity, label],
  );

  return <IntensityContext.Provider value={value}>{children}</IntensityContext.Provider>;
}

export function useIntensity() {
  const ctx = useContext(IntensityContext);
  if (!ctx) throw new Error("useIntensity must be used within IntensityProvider");
  return ctx;
}
