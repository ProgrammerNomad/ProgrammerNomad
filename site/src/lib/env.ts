/** Netlify sets CONTEXT to production | deploy-preview | branch-deploy */
export function shouldAllowIndexing(): boolean {
  const context = process.env.CONTEXT;
  if (context && context !== "production") {
    return false;
  }
  if (process.env.SITE_ENV === "preview") {
    return false;
  }
  return true;
}

export { SITE_URL as siteUrl } from "@/lib/seo/site-config";
