import { LAB_ENTRIES, type LabEntry } from "../research";
import { withIntensityPath } from "../lib/intensityUrl";
import { navigate } from "../lib/navigate";
import { useIntensity } from "./IntensityContext";

function LabLine({ entry }: { entry: LabEntry }) {
  const { intensity } = useIntensity();
  const suffix = entry.inProgress ? " In progress." : "";

  return (
    <p className="lab-entry">
      <strong className="lab-entry__affiliation">
        {entry.affiliation}, {entry.period}.
      </strong>{" "}
      {entry.advisors ? <span className="lab-entry__advisors">{entry.advisors} </span> : null}
      <span className="lab-entry__area">
        {entry.seeAlso ? (
          <>
            See{" "}
            <a
              href={withIntensityPath(`/research#${entry.seeAlso.id}`, intensity)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate(withIntensityPath(`/research#${entry.seeAlso!.id}`, intensity));
              }}
            >
              {entry.seeAlso.label}
            </a>{" "}
            above.
          </>
        ) : (
          <>
            {entry.area}
            {suffix}
          </>
        )}
      </span>
    </p>
  );
}

export function LabsBlock() {
  return (
    <div className="labs-block">
      {LAB_ENTRIES.map((entry) => (
        <LabLine key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
