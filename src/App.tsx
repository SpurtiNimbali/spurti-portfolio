import { useState } from "react";
import { AboutPanel, type StickerEvent } from "./components/AboutPanel";
import { CornerMeta } from "./components/CornerMeta";
import { HeroLine } from "./components/HeroLine";
import { NavDeck } from "./components/NavDeck";
import { StickerLayer } from "./components/StickerLayer";
import { WebGLBackdrop } from "./components/WebGLBackdrop";

export default function App() {
  const [sell, setSell] = useState(0.4);
  const [stickers, setStickers] = useState<StickerEvent[]>([]);

  return (
    <div className="stage">
      <WebGLBackdrop />
      <CornerMeta />
      <main className="mast">
        <HeroLine
          sell={sell}
          onSticker={(s) => setStickers((prev) => [...prev.slice(-4), s])}
        />
      </main>
      <AboutPanel sell={sell} onSell={setSell} />
      <NavDeck />
      <StickerLayer stickers={stickers} />
    </div>
  );
}
