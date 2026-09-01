/**
 * Content still waiting on Spurti is written inline as a "TODO: ..." note, so
 * the gap is visible while editing the data. Nothing that reads as a TODO may
 * reach the page — an empty slot looks finished, a placeholder does not.
 */
export function isTodo(value: string | number | null | undefined): boolean {
  return typeof value === "string" && /^\s*TODO\b/i.test(value);
}

/** The value, or undefined when it is still a placeholder. */
export function realOr<T extends string | number | undefined>(value: T): T | undefined {
  return isTodo(value) ? undefined : value;
}

export function realList<T>(items: T[] | undefined, text: (item: T) => string): T[] {
  return (items ?? []).filter((item) => !isTodo(text(item)));
}
