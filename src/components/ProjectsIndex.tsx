import {
  PROJECT_SECTION_ORDER,
  projectsForSection,
  type ProjectSection,
} from "../projects";
import { tierFromIntensity } from "../lib/projectTier";
import { useIntensity } from "./IntensityContext";
import { ProjectRow } from "./ProjectRow";
import { BasesBlock } from "./BasesBlock";
import { BeforeStanfordGroup } from "./BeforeStanfordGroup";

function SectionHeading({ label }: { label: ProjectSection }) {
  if (label === "before stanford") return null;
  return <h2 className="project-section__heading">{label}</h2>;
}

export function ProjectsIndex() {
  const { intensity } = useIntensity();
  const axisTier = tierFromIntensity(intensity);

  return (
    <div className="projects-index__sections">
      {PROJECT_SECTION_ORDER.map((section) => {
        if (section === "bases") {
          return (
            <section key={section} className="project-section project-section--bases">
              <SectionHeading label={section} />
              <BasesBlock />
            </section>
          );
        }

        if (section === "before stanford") {
          return (
            <section key={section} className="project-section project-section--before">
              <BeforeStanfordGroup
                entries={projectsForSection(section)}
                axisTier={axisTier}
              />
            </section>
          );
        }

        const entries = projectsForSection(section);
        return (
          <section key={section} className="project-section">
            <SectionHeading label={section} />
            <div className="project-section__rows">
              {entries.map((entry) => (
                <ProjectRow key={entry.id} entry={entry} axisTier={axisTier} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
