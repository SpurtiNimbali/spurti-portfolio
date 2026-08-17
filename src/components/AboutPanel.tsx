import { useRef } from "react";
import { LINES, type StickerTone } from "../content";

export type StickerEvent = {
  id: string;
  label: string;
  note: string;
  tone: StickerTone;
  x: number;
  y: number;
};

const SWATCHES = ["#f3eee6", "#e4b39a", "#c5d9d2", "#2f6f6a", "#8fb3aa", "#2b2926"];

type Props = {
  sell: number;
  onSell: (v: number) => void;
};

export function AboutPanel({ sell, onSell }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const index = Math.min(LINES.length - 1, Math.round(sell * (LINES.length - 1)));

  const fromY = (clientY: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onSell(Math.min(1, Math.max(0, (clientY - r.top) / r.height)));
  };

  return (
    <aside className="sell-rail" aria-label="How hard to sell">
      <div
        ref={track}
        className="sell-ladder"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromY(e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) fromY(e.clientY);
        }}
      >
        {LINES.map((item, i) => (
          <button
            key={item.mode}
            type="button"
            className={`sell-chip ${i === index ? "is-on" : ""}`}
            aria-label={item.mode}
            aria-pressed={i === index}
            onClick={() => onSell(i / (LINES.length - 1))}
          >
            <span className="sell-swatch" style={{ background: SWATCHES[i] }} />
            <span className="sell-chip-name">{item.mode}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
