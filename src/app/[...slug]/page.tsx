import { navSections, pages, prevNextFor, crumbsFor } from "@/components/sites/redlotusguide/pages-data";
import { SiteShell } from "@/components/sites/redlotusguide/site-shell";
import { LegacyRedirect } from "@/components/sites/redlotusguide/legacy-redirect";
import { legacyRedirects } from "@/components/sites/redlotusguide/legacy-redirects";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  const routes = Object.values(pages)
    .filter((page) => page.route !== "/")
    .map((page) => page.route);
  return [...routes, ...Object.keys(legacyRedirects)].map((route) => ({
    slug: route.slice(1).split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  if (legacyRedirects[route]) {
    return { title: "Page déplacée | SS Guide", robots: { index: false, follow: true } };
  }
  const page = pages[route];
  if (!page) return {};
  const title = page.fr?.title ?? page.title;
  const description = `${title} — le guide français des screenshares et hack checks.`;
  return {
    title: `${title} | SS Guide`,
    description,
    openGraph: {
      title: `${title} | SS Guide`,
      description,
      siteName: "SS Guide",
      locale: "fr_FR",
      type: "article",
    },
    twitter: { card: "summary", title: `${title} | SS Guide`, description },
  };
}

export default async function DocRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  const target = legacyRedirects[route];
  if (target) return <LegacyRedirect to={target} />;

  const page = pages[route];
  if (!page) notFound();

  const { prev, next } = prevNextFor(page.route);

  return <SiteShell nav={navSections} doc={{ page, crumbs: crumbsFor(page), prev, next }} />;
}
