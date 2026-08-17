import { NavDeck } from "./NavDeck";

export function SceneSection() {
  return (
    <section className="scene-section" aria-label="Work samples">
      <div className="scene-section__inner">
        {/* TODO: wire destinations when project/research/readme pages exist */}
        <NavDeck />
      </div>
    </section>
  );
}
