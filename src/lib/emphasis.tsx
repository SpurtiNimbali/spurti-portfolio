import type { ReactNode } from "react";

const EM_RE = /\*([^*]+)\*/g;

/**
 * Project copy is prose the author edits by hand, so emphasis is written the way
 * it reads in a draft: *like this*. Anything else is left alone.
 */
export function withEmphasis(text: string | undefined): ReactNode {
  if (!text || !text.includes("*")) return text;

  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(EM_RE)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(<em key={`${at}-${match[1]}`}>{match[1]}</em>);
    last = at + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}
