import { useEffect } from "react";
import {
  RESEARCH_PAGE_SECTION_ORDER,
  researchForSection,
  type ResearchPageSection,
} from "../research";
import { ResearchRow } from "./ResearchRow";
import { LabsBlock } from "./LabsBlock";

function SectionHeading({ label }: { label: ResearchPageSection }) {
  return <h2 className="project-section__heading">{label}</h2>;
}

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const id = hash.slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ResearchIndex() {
  useEffect(() => {
    scrollToHash();
  }, []);

  useEffect(() => {
    const onNavigate = () => scrollToHash();
    window.addEventListener("popstate", onNavigate);
    window.addEventListener("spurti:navigate", onNavigate);
    return () => {
      window.removeEventListener("popstate", onNavigate);
      window.removeEventListener("spurti:navigate", onNavigate);
    };
  }, []);

  return (
    <div className="research-index__sections projects-index__sections">
      {RESEARCH_PAGE_SECTION_ORDER.map((section) => {
        if (section === "experience") {
          return (
            <section key={section} className="project-section project-section--experience">
              <SectionHeading label={section} />
              <LabsBlock />
            </section>
          );
        }

        const entries = researchForSection(section);
        return (
          <section key={section} className="project-section">
            <SectionHeading label={section} />
            <div className="project-section__rows">
              {entries.map((entry) => (
                <ResearchRow key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
