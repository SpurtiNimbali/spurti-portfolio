import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type HoverEffectsContextValue = {
  stanfordHover: boolean;
  setStanfordHover: (value: boolean) => void;
};

const HoverEffectsContext = createContext<HoverEffectsContextValue | null>(null);

export function HoverEffectsProvider({ children }: { children: ReactNode }) {
  const [stanfordHover, setStanfordHover] = useState(false);

  const value = useMemo(
    () => ({ stanfordHover, setStanfordHover }),
    [stanfordHover],
  );

  return (
    <HoverEffectsContext.Provider value={value}>{children}</HoverEffectsContext.Provider>
  );
}

export function useHoverEffects() {
  const ctx = useContext(HoverEffectsContext);
  if (!ctx) throw new Error("useHoverEffects must be used within HoverEffectsProvider");
  return ctx;
}
