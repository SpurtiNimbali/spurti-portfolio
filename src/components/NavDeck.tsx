import { useEffect, useRef } from "react";
import { NAV } from "../content";
import { startIcon, type IconHandle, type IconKind } from "../lib/icon3d";

function Icon3D({ kind, staticMode }: { kind: IconKind; staticMode?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<IconHandle | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const handle = startIcon(canvas, kind, { static: staticMode });
    api.current = handle;
    return () => {
      handle.destroy();
      api.current = null;
    };
  }, [kind, staticMode]);

  return <canvas ref={ref} className="icon3d" aria-hidden="true" />;
}

type Props = {
  staticMode?: boolean;
};

export function NavDeck({ staticMode }: Props) {
  return (
    <nav
      className={`nav nav-dock${staticMode ? " nav-dock--static" : ""}`}
      aria-label="Primary"
    >
      {NAV.map((item, i) => (
        <a
          key={item.id}
          href={item.href}
          className="nav-item"
          style={{ "--i": String(i) } as React.CSSProperties}
        >
          <div className="orb">
            <Icon3D kind={item.id} staticMode={staticMode} />
          </div>
        </a>
      ))}
    </nav>
  );
}
