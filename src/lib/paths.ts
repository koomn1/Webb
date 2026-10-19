/**
 * Path helper for Cloudflare Pages (*.pages.dev), GitHub Pages, and local environments
 */
export const getBasePath = (): string => {
  if (typeof window !== "undefined") {
    // Cloudflare Pages (*.pages.dev) or root domain has NO base path
    if (
      window.location.hostname.includes("pages.dev") ||
      window.location.hostname === "localhost" ||
      !window.location.pathname.startsWith("/Webb")
    ) {
      return "";
    }
    // Only if running under /Webb subpath (GitHub Pages default)
    if (window.location.pathname.startsWith("/Webb")) {
      return "/Webb";
    }
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
};

export const asset = (path: string): string => {
  const base = getBasePath();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (base && !cleanPath.startsWith(base)) {
    return `${base}${cleanPath}`;
  }
  return cleanPath;
};

export const appLink = (path: string): string => {
  return path.startsWith("/") ? path : `/${path}`;
};
