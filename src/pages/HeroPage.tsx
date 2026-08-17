import { CornerMeta } from "../components/CornerMeta";
import { HeroLine } from "../components/HeroLine";
import { NavDeck } from "../components/NavDeck";

export function HeroPage() {
  return (
    <section className="hero">
      <CornerMeta />
      <div className="hero-sentence">
        <HeroLine />
      </div>
      <div className="hero-objects">
        <NavDeck />
      </div>
    </section>
  );
}
