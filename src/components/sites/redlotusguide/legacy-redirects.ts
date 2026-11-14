// Old routes kept alive so links already shared keep working.
// The static export cannot send HTTP redirects, so these render a small
// client-side redirect page instead.
export const legacyRedirects: Record<string, string> = {
  "/screensharing-introducttion-and-principles/second-section-red-lotus-principles":
    "/screensharing-introducttion-and-principles/second-section-screenshare-principles",
  "/screensharing-introducttion-and-principles/second-section-red-lotus-principles/red-lotus-principles-for-ethical-and-effective-screensharing":
    "/screensharing-introducttion-and-principles/second-section-screenshare-principles/screenshare-principles-for-ethical-and-effective-screensharing",
};
