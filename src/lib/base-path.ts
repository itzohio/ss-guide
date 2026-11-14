// Set by the GitHub Pages workflow when the site is served from /<repo>/.
// next/image does not prepend basePath to string sources, so files under
// /public need to go through this helper.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
