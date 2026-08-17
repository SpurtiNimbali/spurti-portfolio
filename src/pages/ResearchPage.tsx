import { BackLink } from "../components/BackLink";
import { CornerMeta } from "../components/CornerMeta";
import { ResearchIndex } from "../components/ResearchIndex";

export function ResearchPage() {
  return (
    <div className="research-page content-page">
      <BackLink />
      <CornerMeta />
      <main className="research-index" aria-label="Research">
        <ResearchIndex />
      </main>
    </div>
  );
}
