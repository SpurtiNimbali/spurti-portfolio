import { useEffect, useState } from "react";
import { IntensityAxis } from "./components/IntensityAxis";
import { IntensityProvider } from "./components/IntensityContext";
import { HoverEffectsProvider } from "./components/HoverEffectsContext";
import { IntensityBackdrop } from "./components/IntensityBackdrop";
import { HeroPage } from "./pages/HeroPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ResearchPage } from "./pages/ResearchPage";
import { AboutPage } from "./pages/AboutPage";
import "./styles/about.css";
import { isAboutRoute, normalizePath, ROUTES } from "./lib/routes";

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

  if (pathname === ROUTES.about) {
    return <AboutPage />;
  }

  return <HeroPage />;
}

export default function App() {
  const pathname = usePathname();
  // The hero renders its own axis inline under the sentence.
  const showAxis = !isAboutRoute(pathname) && pathname !== ROUTES.home;

  return (
    <IntensityProvider>
      <HoverEffectsProvider>
        <div className="page">
          <IntensityBackdrop />
          {showAxis ? <IntensityAxis /> : null}
          <AppRoutes />
        </div>
      </HoverEffectsProvider>
    </IntensityProvider>
  );
}
