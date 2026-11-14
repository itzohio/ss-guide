/**
 * Downloads the RedLotus Guide source assets and emits the generated data used
 * by src/components/sites/redlotusguide. Run with `node scripts/fetch-redlotus-assets.mjs`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://itzicehere.gitbook.io";
const PAGE = `${ORIGIN}/redlotusguide`;
const MARKDOWN = `${PAGE}/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses.md`;
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const IMAGE_DIR = join(ROOT, "public/sites/redlotusguide");
const DATA_DIR = join(ROOT, "src/components/sites/redlotusguide");

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  return response.text();
};

/** Pull the first inline icon path that belongs to the element carrying `marker`. */
const iconNear = (html, marker, offset = 0) => {
  const at = html.indexOf(marker);
  if (at === -1) return null;
  const svgAt = html.indexOf("<svg", at + offset);
  if (svgAt === -1) return null;
  const svg = html.slice(svgAt, html.indexOf("</svg>", svgAt) + 6);
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const path = /<path[^>]*\sd="([^"]+)"/.exec(svg)?.[1];
  if (!viewBox || !path) return null;
  return { viewBox, path };
};

/** Find an inline icon by the start of its path data. */
const iconMatching = (html, prefix) => {
  const at = html.indexOf(`d="${prefix}`);
  if (at === -1) return null;
  const svgStart = html.lastIndexOf("<svg", at);
  const svg = html.slice(svgStart, html.indexOf("</svg>", at) + 6);
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const path = /<path[^>]*\sd="([^"]+)"/.exec(svg)?.[1];
  return viewBox && path ? { viewBox, path } : null;
};

const navIcons = (html) => {
  const pattern =
    /<a\b[^>]*href="(\/redlotusguide[^"]*)"[^>]*>\s*<svg[^>]*viewBox="([^"]+)"[^>]*>\s*<path[^>]*\sd="([^"]+)"[^>]*\/?>\s*<\/svg>\s*<span>([^<]*)<\/span>/g;
  const icons = new Map();
  for (const match of html.matchAll(pattern)) {
    const [, href, viewBox, path, title] = match;
    if (icons.has(href)) continue;
    icons.set(href, { viewBox, path, title: decode(title) });
  }
  return icons;
};

const emojiOrIcon = (html) => {
  const svg = iconNear(html, 'class="text-2xl', 0);
  return svg;
};

/** Filename is the stable part shared by direct and proxied URLs. */
const fileKey = (url) => {
  const decoded = decodeURIComponent(decodeURIComponent(url));
  return decoded.split("?")[0].split("/").pop() ?? "";
};

/**
 * Map each original file to the signed 2x proxy URL the page renders.
 * Proxy URLs appear in srcset/imageSrcSet attributes, so scan every occurrence.
 */
const proxySources = (html) => {
  const sources = new Map();
  const candidates = [...html.matchAll(/https:\/\/[^"'\s\\]*~gitbook\/image\?url=[^"'\s\\]*/g)].map(
    (match) => decode(match[0])
  );
  for (const src of candidates) {
    const raw = /[?&]url=([^&]+)/.exec(src)?.[1];
    if (!raw || src.includes("\\")) continue;
    const name = fileKey(raw);
    if (!name) continue;
    // Prefer the 2x variants the page renders (245px cards, then 490px cards).
    const score = /[?&]width=245&dpr=2&/.test(src) ? 3 : /[?&]width=490&dpr=2&/.test(src) ? 2 : 1;
    const current = sources.get(name);
    if (!current || score > current.score) sources.set(name, { src, score });
  }
  return sources;
};

const imageName = (url, index) => {
  const base = basename(decodeURIComponent(new URL(url).pathname)).replace(/[^\w.-]/g, "-");
  const ext = extname(base) || ".jpg";
  return `${String(index).padStart(2, "0")}-${base.slice(0, -ext.length).slice(0, 40)}${ext}`;
};

const download = async (url, path) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path, bytes);
  return bytes.length;
};

const cardRows = (markdown) => {
  const rows = [...markdown.matchAll(/<tr>(.*?)<\/tr>/gs)].map((row) =>
    [...row[1].matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map((cell) => cell[1])
  );
  return rows
    .map((cells) => {
      const label = decode(cells[0]?.replace(/<[^>]+>/g, "").trim() ?? "");
      const href = /href="([^"]+)"/.exec(cells[1] ?? "")?.[1];
      const cover = /href="([^"]+)"/.exec(cells[cells.length - 1] ?? "")?.[1];
      return href && cover ? { label, href: decode(href), cover: decode(cover) } : null;
    })
    .filter(Boolean);
};

const main = async () => {
  const [html, markdown] = await Promise.all([fetchText(PAGE), fetchText(MARKDOWN)]);
  await mkdir(join(IMAGE_DIR, "cards"), { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });

  const coverSrc = /<img[^>]*alt="Page cover"[^>]*src="([^"]+)"/.exec(html)?.[1]
    ?? /<img[^>]*src="([^"]+)"[^>]*alt="Page cover"/.exec(html)?.[1];
  if (!coverSrc) throw new Error("page cover not found");
  const coverBytes = await download(decode(coverSrc), join(IMAGE_DIR, "cover.png"));

  const rows = cardRows(markdown);
  const proxies = proxySources(html);
  const cards = [];
  for (const [index, row] of rows.entries()) {
    const file = imageName(row.cover, index);
    const source = proxies.get(fileKey(row.cover))?.src ?? row.cover;
    const bytes = await download(source, join(IMAGE_DIR, "cards", file));
    cards.push({ ...row, image: `/assets/cards/${file}`, bytes });
  }

  const icons = navIcons(html);
  const chrome = {
    search: iconMatching(html, "M368 208a160"),
    menu: iconNear(html, 'aria-label="Open table of contents"'),
    outline: iconNear(html, 'aria-label="On this page"'),
    gitbook: iconNear(html, "Powered by GitBook"),
    provider: iconNear(html, "ChatGPT"),
    light: iconNear(html, 'aria-label="Switch to light theme"'),
    system: iconNear(html, 'aria-label="Switch to system theme"'),
    dark: iconNear(html, 'aria-label="Switch to dark theme"'),
    chevron: { viewBox: "0 0 320 512", path: "M313.5 239c9.4 9.4 9.4 24.6 0 33.9l-200 200c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l183-183-183-183c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l200 200z" },
  };

  const socials = cards.filter((card) => card.label).slice(0, 2);
  const partners = cards.filter((card) => !socials.includes(card));
  const h1Icon = emojiOrIcon(html) ?? icons.values().next().value;

  const dataFile = `// Generated by scripts/fetch-redlotus-assets.mjs — do not edit by hand.
export type Card = {
  href: string;
  image: string;
  label?: string;
};

export const socials: Card[] = ${JSON.stringify(socials.map(({ label, href, image }) => ({ href, image, ...(label ? { label } : {}) })), null, 2)};

export const partners: Card[] = ${JSON.stringify(partners.map(({ label, href, image }) => ({ href, image, ...(label ? { label } : {}) })), null, 2)};

export const pageIcon = ${JSON.stringify(h1Icon, null, 2)} as const;

export const chromeIcons = ${JSON.stringify(chrome, null, 2)} as const;
`;
  await writeFile(join(DATA_DIR, "generated.ts"), dataFile);

  const navFile = `// Generated by scripts/fetch-redlotus-assets.mjs — do not edit by hand.
export type NavIcon = { viewBox: string; path: string; title: string };

export const navIcons: Record<string, NavIcon> = ${JSON.stringify(Object.fromEntries(icons), null, 2)};
`;
  await writeFile(join(DATA_DIR, "nav-icons.ts"), navFile);

  const missing = Object.entries(chrome).filter(([, value]) => !value).map(([key]) => key);
  console.log(`cover: ${coverBytes} bytes`);
  console.log(`cards: ${cards.length} (${cards.reduce((sum, card) => sum + card.bytes, 0)} bytes)`);
  console.log(`nav icons: ${icons.size}`);
  console.log(`chrome icons missing: ${missing.length ? missing.join(", ") : "none"}`);
  console.log(`h1 icon: ${h1Icon ? "ok" : "missing"}`);
};

await main();
