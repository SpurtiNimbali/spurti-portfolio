import { NavDeck } from "./NavDeck";

export function SceneSection() {
  return (
    <section className="scene-section" aria-label="Work samples">
      <div className="scene-section__inner">
        {/* TODO: bake labels (projects.config, research.md, readme.txt) into the 3D objects */}
        <NavDeck staticMode />
      </div>
    </section>
  );
}
