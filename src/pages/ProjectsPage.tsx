import { BackLink } from "../components/BackLink";
import { CornerMeta } from "../components/CornerMeta";

export function ProjectsPage() {
  return (
    <div className="projects-page">
      <BackLink />
      <CornerMeta />
      <main className="projects-index" aria-label="Projects">
        {/* ProjectsIndex wired in commit 4 */}
      </main>
    </div>
  );
}
