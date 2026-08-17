export const ROUTES = {
  home: "/",
  projects: "/projects",
  research: "/research",
  about: "/about",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export function normalizePath(pathname: string): string {
  if (pathname === ROUTES.projects) return ROUTES.projects;
  if (pathname === ROUTES.research) return ROUTES.research;
  if (pathname === ROUTES.about) return ROUTES.about;
  return ROUTES.home;
}

export function isAboutRoute(pathname: string): boolean {
  return normalizePath(pathname) === ROUTES.about;
}
