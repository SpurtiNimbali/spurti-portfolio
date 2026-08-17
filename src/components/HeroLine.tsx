import { LINES, STICKERS } from "../content";
import type { StickerEvent } from "./AboutPanel";

type Props = {
  sell: number;
  onSticker: (s: StickerEvent) => void;
};

export function HeroLine({ sell, onSticker }: Props) {
  const index = Math.min(LINES.length - 1, Math.round(sell * (LINES.length - 1)));
  const line = LINES[index];

  return (
    <h1 className="hero-line" key={line.mode}>
      {line.parts.map((part, j) => {
        if (!part.mark || !part.href) {
          return <span key={j}>{part.text}</span>;
        }
        const meta = part.sticker ? STICKERS[part.sticker] : null;
        const external = part.href.startsWith("http");
        return (
          <a
            key={`${line.mode}-${j}`}
            className={`mark ${part.mark}`}
            href={part.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            onPointerEnter={(e) => {
              if (!meta) return;
              const r = e.currentTarget.getBoundingClientRect();
              onSticker({
                id: `${part.sticker}-${Date.now()}`,
                label: meta.label,
                note: meta.note,
                tone: meta.tone,
                x: r.left + r.width / 2 + (Math.random() - 0.5) * 70,
                y: r.top - 16,
              });
            }}
          >
            {part.text}
          </a>
        );
      })}
    </h1>
  );
}
