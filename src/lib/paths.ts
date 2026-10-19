/**
 * Path helper for GitHub Pages and local environments
 */
export const getBasePath = (): string => {
  if (typeof window !== "undefined") {
    // If running on GitHub Pages (e.g. /Webb/...)
    if (window.location.pathname.startsWith("/Webb")) {
      return "/Webb";
    }
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
};

export const asset = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // If base is set and path doesn't already start with base, prepend it
  if (base && !cleanPath.startsWith(base)) {
    return `${base}${cleanPath}`;
  }
  return cleanPath;
};

export const appLink = (path: string): string => {
  return path.startsWith("/") ? path : `/${path}`;
};
