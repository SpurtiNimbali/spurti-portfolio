import { useEffect, useState } from "react";
import { IntensityAxis } from "./components/IntensityAxis";
import { IntensityProvider } from "./components/IntensityContext";
import { HoverEffectsProvider } from "./components/HoverEffectsContext";
import { IntensityBackdrop } from "./components/IntensityBackdrop";
import { HeroPage } from "./pages/HeroPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ResearchPage } from "./pages/ResearchPage";
import { normalizePath, ROUTES } from "./lib/routes";

function usePathname() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onNavigate = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onNavigate);
    window.addEventListener("spurti:navigate", onNavigate);
    return () => {
      window.removeEventListener("popstate", onNavigate);
      window.removeEventListener("spurti:navigate", onNavigate);
    };
  }, []);

  return pathname;
}

function AppRoutes() {
  const pathname = usePathname();

  if (pathname === ROUTES.projects) {
    return <ProjectsPage />;
  }

  if (pathname === ROUTES.research) {
    return <ResearchPage />;
  }

  return <HeroPage />;
}

export default function App() {
  return (
    <IntensityProvider>
      <HoverEffectsProvider>
        <div className="page">
          <IntensityBackdrop />
          <IntensityAxis />
          <AppRoutes />
        </div>
      </HoverEffectsProvider>
    </IntensityProvider>
  );
}
