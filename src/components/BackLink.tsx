import { ROUTES } from "../lib/routes";
import { navigate } from "../lib/navigate";

type Props = {
  to?: string;
  label?: string;
};

export function BackLink({ to = ROUTES.home, label = "← home" }: Props) {
  return (
    <a
      className="back-link"
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {label}
    </a>
  );
}
