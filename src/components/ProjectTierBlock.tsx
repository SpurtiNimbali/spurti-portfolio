import type { ReactNode } from "react";

type Props = {
  visible: boolean;
  children: ReactNode;
  className?: string;
};

export function ProjectTierBlock({ visible, children, className = "" }: Props) {
  return (
    <div
      className={`project-tier-block${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
