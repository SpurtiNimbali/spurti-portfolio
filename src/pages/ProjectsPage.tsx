import "../styles/projects.css";
import { BackLink } from "../components/BackLink";
import { CornerMeta } from "../components/CornerMeta";
import { ProjectsIndex } from "../components/ProjectsIndex";

export function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="pj-top">
        <BackLink />
        <CornerMeta />
        <p className="pj-top__kicker">projects.py</p>
        <p className="pj-top__intro">Things that shipped.</p>
      </div>

      <main className="pj-main" aria-label="Projects">
        <ProjectsIndex />
      </main>
    </div>
  );
}
