import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NAV } from "../content";
import { withIntensityPath } from "../lib/intensityUrl";
import { navigate } from "../lib/navigate";
import { startIcon, type IconHandle, type IconKind } from "../lib/icon3d";
import { useIntensity } from "./IntensityContext";

const PARALLAX_PX = [6, 10, 14];
const ENTER_STAGGER_MS = 80;
const ENTER_OFFSET_PX = 16;

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
  const { intensity } = useIntensity();
  const rowRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [entered, setEntered] = useState<boolean[]>(() => NAV.map(() => false));
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const enterStarted = useRef(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setEntered(NAV.map(() => true));
      return;
    }

    const row = rowRef.current;
    if (!row) return;

    const runEnter = () => {
      if (enterStarted.current) return;
      enterStarted.current = true;
      NAV.forEach((_, i) => {
        window.setTimeout(() => {
          setEntered((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * ENTER_STAGGER_MS);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) runEnter();
      },
      { threshold: 0.12 },
    );

    observer.observe(row);

    const rect = row.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runEnter();
    }

    return () => observer.disconnect();
  }, [reduced]);

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
    <div ref={rowRef} className="nav-row">
      <nav ref={dockRef} className="nav nav-dock" aria-label="Primary">
        {NAV.map((item, i) => (
          <div
            key={item.id}
            className={`nav-item-shell${entered[i] ? " is-entered" : ""}`}
            style={{ "--enter-y": `${ENTER_OFFSET_PX}px` } as CSSProperties}
          >
            <a
              href={withIntensityPath(item.href, intensity)}
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
              onClick={(e) => {
                if (!item.href.startsWith("/")) return;
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate(withIntensityPath(item.href, intensity));
              }}
            >
              <div className="orb">
                <Icon3D kind={item.id} hovered={focus === item.id} />
              </div>
              <span className="nav-item__label">{item.title}</span>
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
}
