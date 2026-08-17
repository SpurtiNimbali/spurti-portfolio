import { IntensityAxis } from "./components/IntensityAxis";
import { IntensityProvider } from "./components/IntensityContext";
import { CornerMeta } from "./components/CornerMeta";
import { HeroLine } from "./components/HeroLine";
import { IntensityBackdrop } from "./components/IntensityBackdrop";
import { SceneSection } from "./components/SceneSection";

export default function App() {
  return (
    <IntensityProvider>
      <div className="page">
        <IntensityBackdrop />
        <CornerMeta />
        <section className="hero-section">
          <main className="mast">
            <HeroLine />
          </main>
          <IntensityAxis />
        </section>
        <SceneSection />
      </div>
    </IntensityProvider>
  );
}
