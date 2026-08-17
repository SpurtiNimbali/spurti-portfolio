import { useEffect, useRef, useState } from "react";
import { NAV } from "../content";
import { startIcon, ICON_REV, type IconHandle, type IconKind } from "../lib/icon3d";

function Icon3D({ kind, hovered }: { kind: IconKind; hovered: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<IconHandle | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const handle = startIcon(canvas, kind);
    handle.setHover(hovered);
    api.current = handle;
    return () => {
      handle.destroy();
      api.current = null;
    };
    // hovered is applied via setHover; restarting the renderer on hover would kill the spring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, ICON_REV]);

  useEffect(() => {
    api.current?.setHover(hovered);
  }, [hovered]);

  return <canvas ref={ref} className="icon3d" aria-hidden="true" />;
}

export function NavDeck() {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <nav className={`nav nav-dock ${focus ? "has-focus" : ""}`} aria-label="Primary">
      {NAV.map((item, i) => (
        <a
          key={item.id}
          href={item.href}
          className={`nav-item ${focus === item.id ? "is-focus" : ""}`}
          style={{ "--i": String(i) } as React.CSSProperties}
          onPointerEnter={() => setFocus(item.id)}
          onPointerLeave={() => setFocus(null)}
        >
          <div className="orb">
            <Icon3D kind={item.id} hovered={focus === item.id} />
            <span className="frost" aria-hidden="true" />
          </div>
          <span className="nav-pill">{item.file}</span>
          <span className="nav-hint">{item.hint}</span>
        </a>
      ))}
    </nav>
  );
}
