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

/*
 * The tone used to travel in the URL as ?v=, so scrubbing the bar left a query
 * string in the address bar and in everything copied out of it. It is in-page
 * state now — a soft navigation keeps this provider mounted, so nothing has to
 * carry it between pages — and the only remaining job for ?v= is to honour the
 * links shared while it was written, then tidy itself away.
 */
function readIntensityFromUrl(): number | null {
  const raw = new URLSearchParams(window.location.search).get("v");
  if (raw === null) return null;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < INTENSITY_MIN || n > INTENSITY_MAX) return null;
  return n;
}

function stripIntensityFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("v")) return;
  url.searchParams.delete("v");
  // Anything else the URL was carrying — other params, the hash a research
  // link lands on — survives, and the path is untouched so the router sees
  // nothing happen.
  window.history.replaceState(null, "", url);
}

export function IntensityProvider({ children }: { children: ReactNode }) {
  const [intensity, setIntensityState] = useState(() => readIntensityFromUrl() ?? DEFAULT_INTENSITY);

  const setIntensity = (value: number) => {
    setIntensityState(Math.min(INTENSITY_MAX, Math.max(INTENSITY_MIN, value)));
  };

  useEffect(() => {
    // On a back button as well as on load: a tab open from before the param
    // stopped being written can still walk back onto an entry that has one.
    const adopt = () => {
      const fromUrl = readIntensityFromUrl();
      if (fromUrl !== null) setIntensityState(fromUrl);
      stripIntensityFromUrl();
    };

    adopt();
    window.addEventListener("popstate", adopt);
    return () => window.removeEventListener("popstate", adopt);
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
