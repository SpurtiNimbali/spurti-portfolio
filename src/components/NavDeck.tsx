import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NAV } from "../content";
import { withIntensityPath } from "../lib/intensityUrl";
import { navigate } from "../lib/navigate";
import { useIntensity } from "./IntensityContext";
import { ProjectsMark, ReadMeMark, ResearchMark } from "./PixelMarks";

const PARALLAX_PX = [8, 13, 18];
const ENTER_STAGGER_MS = 120;
const ENTER_OFFSET_PX = 24;

function Mark({ id }: { id: (typeof NAV)[number]["id"] }) {
  if (id === "projects") return <ProjectsMark />;
  if (id === "research") return <ResearchMark />;
  return <ReadMeMark />;
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
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.12;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.12;
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
                <Mark id={item.id} />
              </div>
              <div className="nav-item__caption">
                <span className="nav-item__pill">{item.file}</span>
                <div className="nav-item__detail">
                  <strong>{item.file}</strong>
                  <p>{item.hint}</p>
                  <span className="nav-item__cta">{item.cta}</span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
}
