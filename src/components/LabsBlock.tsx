import { LAB_ENTRIES } from "../research";

export function LabsBlock() {
  return (
    <ol className="labs-list">
      {LAB_ENTRIES.map((entry) => (
        <li key={entry.id} className="lab-line">
          <p className="lab-line__period">{entry.period}</p>
          <h3 className="lab-line__name">
            <a className="pj-link" href={entry.href} target="_blank" rel="noreferrer">
              {entry.affiliation}
              <span className="pj-link__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </h3>

          <p className="lab-line__role">{entry.role}</p>
          <p className="lab-line__work">{entry.work}</p>

          {entry.advisors ? <p className="lab-line__advisors">Advised by {entry.advisors}</p> : null}
        </li>
      ))}
    </ol>
  );
}
