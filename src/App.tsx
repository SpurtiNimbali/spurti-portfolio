import { IntensityAxis } from "./components/IntensityAxis";
import { IntensityProvider } from "./components/IntensityContext";
import { HoverEffectsProvider } from "./components/HoverEffectsContext";
import { CornerMeta } from "./components/CornerMeta";
import { HeroLine } from "./components/HeroLine";
import { IntensityBackdrop } from "./components/IntensityBackdrop";
import { NavDeck } from "./components/NavDeck";

export default function App() {
  return (
    <IntensityProvider>
      <HoverEffectsProvider>
        <div className="page">
          <IntensityBackdrop />
          <IntensityAxis />
          <section className="hero">
            <CornerMeta />
            <div className="hero-sentence">
              <HeroLine />
            </div>
            <div className="hero-objects">
              <NavDeck />
            </div>
          </section>
        </div>
      </HoverEffectsProvider>
    </IntensityProvider>
  );
}
