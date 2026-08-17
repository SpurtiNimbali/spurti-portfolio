export const ROUTES = {
  home: "/",
  projects: "/projects",
  research: "/research",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export function normalizePath(pathname: string): AppRoute {
  if (pathname === ROUTES.projects) return ROUTES.projects;
  if (pathname === ROUTES.research) return ROUTES.research;
  return ROUTES.home;
}
