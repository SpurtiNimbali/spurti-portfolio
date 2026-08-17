import type { ProjectEntry } from "../projects";
import type { ProjectTier } from "../lib/projectTier";
import { ProjectRow } from "./ProjectRow";

type Props = {
  entries: ProjectEntry[];
  axisTier: ProjectTier;
};

export function BeforeStanfordGroup({ entries, axisTier }: Props) {
  return (
    <details className="before-stanford">
      <summary className="project-section__heading before-stanford__summary">before stanford</summary>
      <div className="before-stanford__entries">
        {entries.map((entry) => (
          <ProjectRow key={entry.id} entry={entry} axisTier={axisTier} />
        ))}
      </div>
    </details>
  );
}
