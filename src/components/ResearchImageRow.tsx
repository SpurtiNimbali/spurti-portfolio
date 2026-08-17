import type { ResearchImageRow as ResearchImageRowType } from "../research";

type Props = {
  imageRow: ResearchImageRowType;
};

function isPlaceholder(src: string) {
  return src.startsWith("TODO:");
}

export function ResearchImageRow({ imageRow }: Props) {
  return (
    <figure className="research-image-row">
      <div className="research-image-row__stages">
        {imageRow.stages.map((stage) => (
          <div key={stage.label} className="research-image-row__stage">
            <div className="research-image-row__frame">
              {isPlaceholder(stage.src) ? (
                <span className="research-image-row__placeholder">{stage.src}</span>
              ) : (
                <img src={stage.src} alt={stage.alt} loading="lazy" />
              )}
            </div>
            <figcaption className="research-image-row__label">{stage.label}</figcaption>
          </div>
        ))}
      </div>
      <figcaption className="research-image-row__caption">{imageRow.caption}</figcaption>
    </figure>
  );
}
