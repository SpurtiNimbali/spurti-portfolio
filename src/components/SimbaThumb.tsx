import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  index: number;
  style?: CSSProperties;
};

function SimbaImage({ level, visible }: { level: number; visible: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`simba-thumb__frame${visible ? " is-visible" : ""}`}>
      {(!loaded || failed) && (
        <div className="simba-thumb__placeholder" title="TODO: Simba PNG asset">
          <span className="simba-thumb__placeholder-dot" />
        </div>
      )}
      {!failed && (
        <img
          className="simba-thumb__img"
          src={`/simba/${level}.png`}
          alt=""
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function SimbaThumb({ index, style }: Props) {
  const [shown, setShown] = useState(index);
  const [leaving, setLeaving] = useState<number | null>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (index === shown) return;
    if (reduced) {
      setShown(index);
      setLeaving(null);
      return;
    }
    setLeaving(shown);
    setShown(index);
    const t = window.setTimeout(() => setLeaving(null), 120);
    return () => window.clearTimeout(t);
  }, [index, reduced, shown]);

  return (
    <div className="simba-thumb" style={style} aria-hidden="true">
      {leaving !== null ? <SimbaImage level={leaving} visible={false} /> : null}
      <SimbaImage level={shown} visible />
    </div>
  );
}
