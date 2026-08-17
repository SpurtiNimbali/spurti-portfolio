import type { ResearchBlock as ResearchBlockType } from "../projects";

type Props = {
  block: ResearchBlockType;
};

export function ResearchBlock({ block }: Props) {
  return (
    <article className="research-block">
      <h3 className="research-block__title">
        {block.title} — {block.period}
      </h3>
      {block.advisors ? <p className="research-block__advisors">{block.advisors}</p> : null}
      <p className="research-block__line">{block.line}</p>
    </article>
  );
}
