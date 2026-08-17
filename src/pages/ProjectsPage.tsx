import { BackLink } from "../components/BackLink";
import { CornerMeta } from "../components/CornerMeta";
import { ProjectsIndex } from "../components/ProjectsIndex";

export function ProjectsPage() {
  return (
    <div className="projects-page content-page">
      <BackLink />
      <CornerMeta />
      <main className="projects-index" aria-label="Projects">
        <ProjectsIndex />
      </main>
    </div>
  );
}
