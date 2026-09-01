import { projectsForSection } from "../projects";
import { tierFromIntensity } from "../lib/projectTier";
import { useIntensity } from "./IntensityContext";
import { ProjectBand } from "./ProjectBand";
import { ProjectTail } from "./ProjectTail";

export function ProjectsIndex() {
  const { intensity } = useIntensity();
  const axisTier = tierFromIntensity(intensity);

  const selected = projectsForSection("selected");
  const alsoBuilt = projectsForSection("also built");
  const before = projectsForSection("before stanford");

  return (
    <>
      <div className="pj-bands">
        {selected.map((entry, i) => (
          <ProjectBand key={entry.id} entry={entry} axisTier={axisTier} index={i} />
        ))}
      </div>

      <div className="pj-tails">
        <ProjectTail
          heading="also built"
          blurb="Shorter runs: hackathons, internships, and coursework that turned into something."
          entries={alsoBuilt}
          axisTier={axisTier}
        />

        <ProjectTail
          heading="before stanford"
          blurb="High school work, mostly assistive tools for health and accessibility."
          entries={before}
          axisTier={axisTier}
        />
      </div>
    </>
  );
}
