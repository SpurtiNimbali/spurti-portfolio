import type { ReactNode } from "react";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseAboutBody(body: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of body.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push(body.slice(last, index));
    }
    const href = match[2];
    const external = href.startsWith("http");
    parts.push(
      <a
        key={`${index}-${match[1]}`}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {match[1]}
      </a>,
    );
    last = index + match[0].length;
  }

  if (last < body.length) {
    parts.push(body.slice(last));
  }

  return parts.length ? parts : [body];
}

export function isAboutTodo(text: string): boolean {
  return text.trimStart().startsWith("TODO:");
}
