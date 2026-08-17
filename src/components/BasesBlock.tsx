import { BASES_BLOCK } from "../projects";

export function BasesBlock() {
  return (
    <article className="bases-block">
      <h3 className="bases-block__title">
        {BASES_BLOCK.title} — {BASES_BLOCK.period}
      </h3>
      <p className="bases-block__body">{BASES_BLOCK.body}</p>
    </article>
  );
}
