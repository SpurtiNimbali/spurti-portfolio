import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NAV } from "../content";
import { startIcon, type IconHandle, type IconKind } from "../lib/icon3d";

const PARALLAX_PX = [6, 10, 14];

function Icon3D({ kind, hovered }: { kind: IconKind; hovered: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<IconHandle | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const handle = startIcon(canvas, kind, { ambient: true });
    api.current = handle;
    return () => {
      handle.destroy();
      api.current = null;
    };
  }, [kind]);

  useEffect(() => {
    api.current?.setHover(hovered);
  }, [hovered]);

  return <canvas ref={ref} className="icon3d" aria-hidden="true" />;
}

export function NavDeck() {
  const dockRef = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.5;
      pointer.current.tx = (e.clientX - cx) / cx;
      pointer.current.ty = (e.clientY - cy) / cy;
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.08;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.08;
      dockRef.current?.style.setProperty("--px", pointer.current.x.toFixed(4));
      dockRef.current?.style.setProperty("--py", pointer.current.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <nav ref={dockRef} className="nav nav-dock" aria-label="Primary">
      {NAV.map((item, i) => (
        <a
          key={item.id}
          href={item.href}
          className={`nav-item${focus === item.id ? " is-focus" : ""}`}
          aria-label={item.title}
          style={
            {
              "--i": String(i),
              "--parallax": `${PARALLAX_PX[i] ?? 10}px`,
            } as CSSProperties
          }
          onPointerEnter={() => setFocus(item.id)}
          onPointerLeave={() => setFocus(null)}
          onFocus={() => setFocus(item.id)}
          onBlur={() => setFocus(null)}
        >
          <div className="orb">
            <Icon3D kind={item.id} hovered={focus === item.id} />
          </div>
          <span className="nav-item__label">{item.file}</span>
        </a>
      ))}
    </nav>
  );
}
