import { isAboutTodo, parseAboutBody } from "../lib/parseAboutBody";

export type AboutBlock = {
  label: string;
  body: string;
};

type Props = {
  blocks: AboutBlock[];
};

export function AboutBlocks({ blocks }: Props) {
  return (
    <div className="about-blocks">
      {blocks.map((block) => (
        <section key={block.label} className="about-block" aria-labelledby={`about-${block.label}`}>
          <h2 className="about-block__label" id={`about-${block.label}`}>
            {block.label}
          </h2>
          <p
            className={`about-block__body${isAboutTodo(block.body) ? " about-block__body--todo" : ""}`}
          >
            {parseAboutBody(block.body)}
          </p>
        </section>
      ))}
    </div>
  );
}
