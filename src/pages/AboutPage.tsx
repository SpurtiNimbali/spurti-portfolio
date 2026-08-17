import { BackLink } from "../components/BackLink";
import { AboutBlocks } from "../components/AboutBlocks";
import { AboutContact } from "../components/AboutContact";
import { CornerMeta } from "../components/CornerMeta";
import { about, aboutContact } from "../content/about";

export function AboutPage() {
  return (
    <div className="about-page content-page">
      <BackLink />
      <CornerMeta />
      <main className="about-index" aria-label="About">
        <AboutContact links={aboutContact} />
        <AboutBlocks blocks={about} />
        <AboutContact links={aboutContact} />
      </main>
    </div>
  );
}
