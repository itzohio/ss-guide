import { navSections, pages } from "@/components/sites/redlotusguide/pages-data";
import { SiteShell } from "@/components/sites/redlotusguide/site-shell";

const nextRoute =
  "/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses/what-is-a-hack-check";

export default function Home() {
  const next = pages[nextRoute];
  const homeNext = next
    ? { route: next.route, title: next.title, titleFr: next.fr?.title ?? next.title }
    : undefined;

  return <SiteShell nav={navSections} homeNext={homeNext} />;
}
