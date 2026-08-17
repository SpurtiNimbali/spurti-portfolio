export const ROUTES = {
  home: "/",
  projects: "/projects",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export function normalizePath(pathname: string): AppRoute {
  if (pathname === ROUTES.projects) return ROUTES.projects;
  return ROUTES.home;
}
