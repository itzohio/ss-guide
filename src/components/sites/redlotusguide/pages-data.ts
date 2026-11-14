import frenchData from "@/content/redlotusguide/pages.fr.json";
import data from "@/content/redlotusguide/pages.json";

export type Run = {
  v: string;
  b?: boolean;
  i?: boolean;
  c?: boolean;
  u?: boolean;
  href?: string;
  img?: string;
  alt?: string;
};

export type JsonBlock =
  | { type: "p"; runs: Run[] }
  | { type: "h"; level: number; id: string; runs: Run[] }
  | { type: "ul" | "ol"; items: { runs: Run[]; children: JsonBlock[] }[] }
  | { type: "quote"; blocks: JsonBlock[] }
  | { type: "code"; lang: string; text: string }
  | { type: "hr" }
  | { type: "img"; alt: string; src: string };

export type PageIcon = { viewBox: string; path: string } | null;

export type Heading = { id: string; text: string; level: number };

export type FrenchPage = {
  title: string;
  blocks: JsonBlock[];
  headings: Heading[];
};

export type Page = {
  route: string;
  source: string;
  title: string;
  icon: PageIcon;
  blocks: JsonBlock[];
  headings: Heading[];
  order: number;
  fr?: FrenchPage;
};

const raw = data as unknown as { pages: Record<string, Page>; order: string[] };

const frenchPages = (frenchData as unknown as { pages: Record<string, FrenchPage> }).pages;
for (const [route, page] of Object.entries(raw.pages)) {
  page.fr = frenchPages[route];
}

export const pages = raw.pages;
export const pageOrder = raw.order;
export const pageList = pageOrder.map((route) => pages[route]).filter(Boolean);
export const bySource = new Map(pageList.map((page) => [page.source, page]));

const SECTION_TITLES: Record<string, string> = {
  "screensharing-introducttion-and-principles": "ScreenSharing Introducttion and Principles",
  "screensharing-general-knowledge": "ScreenSharing General Knowledge",
  "screensharing-minecraft-knowledge": "ScreenSharing Minecraft Knowledge",
  "advanced-explanation-of-artifacts": "Advanced Explanation of Artifacts",
  "screenshare-tools": "ScreenShare Tools",
};

const SECTION_TITLES_FR: Record<string, string> = {
  "screensharing-introducttion-and-principles": "Introduction et principes du ScreenSharing",
  "screensharing-general-knowledge": "Connaissances générales du ScreenSharing",
  "screensharing-minecraft-knowledge": "Connaissances Minecraft du ScreenSharing",
  "advanced-explanation-of-artifacts": "Explication avancée des artefacts",
  "screenshare-tools": "Outils de ScreenShare",
};

const sectionKey = (source: string) => source.split("/")[2] ?? "";

export type NavNode = {
  route: string;
  title: string;
  titleFr: string;
  icon: PageIcon;
  children: NavNode[];
};

export type NavSection = { key: string; title: string; titleFr: string; nodes: NavNode[] };

const buildNav = (): NavSection[] => {
  const nodes = new Map<string, NavNode>();
  for (const page of pageList) {
    nodes.set(page.source, {
      route: page.route,
      title: page.title,
      titleFr: page.fr?.title ?? page.title,
      icon: page.icon,
      children: [],
    });
  }

  const grouped = new Map<string, NavNode[]>();
  for (const page of pageList) {
    const node = nodes.get(page.source);
    if (!node) continue;
    const parentSource = page.source.split("/").slice(0, -1).join("/");
    const parent = bySource.get(parentSource);
    if (parent) {
      nodes.get(parent.source)?.children.push(node);
    } else {
      const key = sectionKey(page.source);
      const bucket = grouped.get(key) ?? [];
      bucket.push(node);
      grouped.set(key, bucket);
    }
  }

  return Object.keys(SECTION_TITLES).map((key) => ({
    key,
    title: SECTION_TITLES[key],
    titleFr: SECTION_TITLES_FR[key],
    nodes: grouped.get(key) ?? [],
  }));
};

export const navSections = buildNav();

export const activeTrail = (route: string): string[] => {
  const page = pages[route];
  if (!page) return [];
  const trail: string[] = [];
  let current: Page | undefined = page;
  while (current) {
    trail.unshift(current.route);
    const parentSource: string = current.source.split("/").slice(0, -1).join("/");
    current = bySource.get(parentSource);
  }
  return trail;
};

export type Crumb = { title: string; titleFr: string; route: string | null };

export const crumbsFor = (page: Page): Crumb[] => {
  const chain: Crumb[] = [];
  let current: Page | undefined = page;

  while (current) {
    const parentSource: string = current.source.split("/").slice(0, -1).join("/");
    const parent: Page | undefined = bySource.get(parentSource);
    if (!parent) break;
    chain.unshift({ title: parent.title, titleFr: parent.fr?.title ?? parent.title, route: parent.route });
    current = parent;
  }

  const section = navSections.find((entry) => entry.key === sectionKey(page.source));
  if (section) {
    chain.unshift({ title: section.title, titleFr: section.titleFr, route: section.nodes[0]?.route ?? null });
  }

  return chain;
};

export const prevNextFor = (route: string) => {
  const index = pageOrder.indexOf(route);
  return {
    prev: index > 0 ? pages[pageOrder[index - 1]] : null,
    next: index >= 0 && index < pageOrder.length - 1 ? pages[pageOrder[index + 1]] : null,
  };
};
