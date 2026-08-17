import { useEffect, useState } from "react";
import type { StickerEvent } from "./AboutPanel";

type Props = { stickers: StickerEvent[] };

export function StickerLayer({ stickers }: Props) {
  const [visible, setVisible] = useState<StickerEvent[]>([]);

  useEffect(() => {
    setVisible(stickers.slice(-5));
  }, [stickers]);

  return (
    <div className="stickers" aria-hidden="true">
      {visible.map((s) => (
        <aside
          key={s.id}
          className={`sticker tone-${s.tone}`}
          style={{ left: s.x, top: s.y }}
        >
          <strong>{s.label}</strong>
          <em>{s.note}</em>
        </aside>
      ))}
    </div>
  );
}
