import { BackLink } from "../components/BackLink";
import { CornerMeta } from "../components/CornerMeta";

export function ResearchPage() {
  return (
    <div className="research-page content-page">
      <BackLink />
      <CornerMeta />
      <main className="research-index" aria-label="Research">
        {/* ResearchIndex wired in commit 4 */}
      </main>
    </div>
  );
}
