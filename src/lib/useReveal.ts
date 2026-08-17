import { useEffect, useRef, useState } from "react";

/**
 * Marks an element once it has scrolled into view, so entries can rise into
 * place. Reveals immediately when motion is unwelcome or IO is unavailable.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, revealed };
}
