import { useIntensity } from "./IntensityContext";
import { ROUTES } from "../lib/routes";
import { withIntensity } from "../lib/intensityUrl";
import { navigate } from "../lib/navigate";

type Props = {
  to?: string;
  label?: string;
};

export function BackLink({ to = ROUTES.home, label = "← home" }: Props) {
  const { intensity } = useIntensity();

  return (
    <a
      className="back-link"
      href={withIntensity(to, intensity)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(withIntensity(to, intensity));
      }}
    >
      {label}
    </a>
  );
}
