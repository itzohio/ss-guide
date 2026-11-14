/**
 * Fetches every RedLotus Guide page, converts the markdown into a small block
 * model and writes src/content/redlotusguide/pages.json + downloaded images.
 *
 * Run with: node scripts/fetch-redlotus-pages.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://itzicehere.gitbook.io";
const site = "/redlotusguide";
const outFile = path.join(root, "src/content/redlotusguide/pages.json");
const imageDir = path.join(root, "public/sites/redlotusguide/pages");

const ENTITIES = {
  "&#x20;": " ",
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Split inline markdown into styled runs. */
const parseInline = (input, style = {}) => {
  const runs = [];
  let buffer = "";
  let i = 0;

  const flush = () => {
    if (!buffer) return;
    const last = runs[runs.length - 1];
    if (last && !last.href && last.b === style.b && last.i === style.i && last.c === style.c && last.u === style.u) {
      last.v += buffer;
    } else {
      runs.push({ v: buffer, ...style });
    }
    buffer = "";
  };

  while (i < input.length) {
    const rest = input.slice(i);

    if (input[i] === "\\" && /[\\`*_{}[\]()#+\-.!>~|]/.test(input[i + 1] ?? "")) {
      buffer += input[i + 1];
      i += 2;
      continue;
    }

    if (rest.startsWith("***")) {
      const end = input.indexOf("***", i + 3);
      if (end > i + 3) {
        flush();
        runs.push(...parseInline(input.slice(i + 3, end), { ...style, b: true, i: true }));
        i = end + 3;
        continue;
      }
    }

    if (rest.startsWith("**")) {
      const end = input.indexOf("**", i + 2);
      if (end > i + 2) {
        flush();
        runs.push(...parseInline(input.slice(i + 2, end), { ...style, b: true }));
        i = end + 2;
        continue;
      }
    }

    if (input[i] === "*" && input[i + 1] !== " ") {
      const end = input.indexOf("*", i + 1);
      if (end > i + 1 && input[end + 1] !== "*") {
        flush();
        runs.push(...parseInline(input.slice(i + 1, end), { ...style, i: true }));
        i = end + 1;
        continue;
      }
    }

    if (input[i] === "`") {
      const end = input.indexOf("`", i + 1);
      if (end > i) {
        flush();
        runs.push({ v: input.slice(i + 1, end), ...style, c: true });
        i = end + 1;
        continue;
      }
    }

    if (rest.startsWith("[![")) {
      const linked = /^\[!\[([^\]]*)\]\(([^)\s]+)\)\]\(([^)\s]+)\)/.exec(rest);
      if (linked) {
        flush();
        runs.push({ v: "", img: linked[2], alt: linked[1], href: localHref(linked[3]) });
        i += linked[0].length;
        continue;
      }
    }

    if (rest.startsWith("![")) {
      const image = /^!\[([^\]]*)\]\(([^)\s]+)\)/.exec(rest);
      if (image) {
        flush();
        runs.push({ v: "", img: image[2], alt: image[1] });
        i += image[0].length;
        continue;
      }
    }

    if (input[i] === "[") {
      const link = /^\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(rest);
      if (link) {
        flush();
        const [, label, href] = link;
        const resolved = localHref(href);
        for (const run of parseInline(label, style)) runs.push({ ...run, href: resolved });
        i += link[0].length;
        continue;
      }
    }

    if (input[i] === "&") {
      const entity = Object.keys(ENTITIES).find((key) => rest.startsWith(key));
      if (entity) {
        buffer += ENTITIES[entity];
        i += entity.length;
        continue;
      }
    }

    if (input[i] === "<") {
      const html = /^<(\/?)(u|sup|sub|strong|em|code|mark)\s*>/.exec(rest);
      if (html) {
        const closing = html[1] === "/";
        const tag = html[2];
        flush();
        if (!closing) {
          // Render the tag's contents with the matching style by scanning to its close.
          const closeAt = input.toLowerCase().indexOf(`</${tag}>`, i);
          if (closeAt > i) {
            const inner = input.slice(i + html[0].length, closeAt);
            const next = { ...style };
            if (tag === "u" || tag === "mark" || tag === "sup" || tag === "sub") next.u = true;
            if (tag === "strong") next.b = true;
            if (tag === "em") next.i = true;
            if (tag === "code") next.c = true;
            runs.push(...parseInline(inner, next));
            i = closeAt + tag.length + 3;
            continue;
          }
        }
        i += html[0].length;
        continue;
      }
      if (/^<br\s*\/?>/.test(rest)) {
        flush();
        runs.push({ v: "\n" });
        i += rest.match(/^<br\s*\/?>/)[0].length;
        continue;
      }
      const strip = /^<\/?[a-zA-Z][^>]*>/.exec(rest);
      if (strip) {
        i += strip[0].length;
        continue;
      }
    }

    buffer += input[i];
    i += 1;
  }

  flush();
  return runs;
};

/** Rewrite GitBook absolute links to local ones. */
const localHref = (href) => {
  if (href.startsWith("#")) return href;
  const prefix = `${origin}${site}`;
  if (href.startsWith(prefix)) {
    const rest = href.slice(prefix.length).replace(/\.md$/, "");
    return rest === "" ? "/" : rest;
  }
  if (href.startsWith(`${site}/`)) return href.slice(site.length).replace(/\.md$/, "");
  if (href.startsWith("/redlotusguide/")) return href.slice(site.length);
  return href;
};

/** Normalise the "* * item" nesting GitBook's markdown export produces. */
export const normaliseListPrefixes = (text) =>
  text
    .split("\n")
    .map((line) => {
      const match = /^([ \t]*)((?:[*+-][ \t]+){2,})(.*)$/.exec(line);
      if (!match) return line;
      const levels = match[2].trim().split(/[ \t]+/).filter(Boolean).length;
      return `${match[1]}${"  ".repeat(levels - 1)}- ${match[3]}`;
    })
    .join("\n");

/** Visit every inline run in a block tree. */
const walkRuns = (blocks, visit) => {
  for (const block of blocks) {
    if (block.runs) block.runs.forEach(visit);
    if (block.type === "quote") walkRuns(block.blocks, visit);
    if (block.items) {
      for (const item of block.items) {
        item.runs.forEach(visit);
        item.children.forEach((child) => walkRuns([child], visit));
      }
    }
  }
};

const stripBoilerplate = (text) =>
  text.replace(/^> For the complete documentation index[\s\S]*?\n\n/, "").trim();

const listMarker = (line) => {
  const match = /^([ \t]*)([*+-]|\d+\.)\s+(.*)$/.exec(line);
  if (!match) return null;
  return { indent: match[1].replace(/\t/g, "  ").length, ordered: /\d/.test(match[2]), text: match[3] };
};

const isListLine = (line) => listMarker(line) !== null;

/** Parse a list starting at lines[start] whose marker indent is `indent`. */
const parseList = (lines, start, indent) => {
  const ordered = listMarker(lines[start]).ordered;
  const items = [];
  let i = start;

  while (i < lines.length) {
    const marker = listMarker(lines[i]);
    if (!marker || marker.indent !== indent || marker.ordered !== ordered) break;

    const item = { runs: parseInline(marker.text.trim()), children: [] };
    i += 1;

    // Continuation text and nested lists until the next sibling or dedent.
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        const next = lines[i + 1];
        const nextMarker = next ? listMarker(next) : null;
        if (nextMarker && nextMarker.indent >= indent) {
          i += 1;
          continue;
        }
        break;
      }
      const nested = listMarker(line);
      if (nested && nested.indent > indent) {
        const result = parseList(lines, i, nested.indent);
        item.children.push(result.list);
        i = result.next;
        continue;
      }
      if (nested && nested.indent <= indent) break;

      const leading = /^[ \t]*/.exec(line)[0].replace(/\t/g, "  ").length;
      if (leading > indent) {
        item.runs.push(...parseInline(line.trim()));
        i += 1;
        continue;
      }
      break;
    }

    items.push(item);

    if (i < lines.length && !lines[i].trim()) {
      const nextMarker = lines[i + 1] ? listMarker(lines[i + 1]) : null;
      if (nextMarker && nextMarker.indent === indent) {
        i += 1;
      } else {
        break;
      }
    }
  }

  return { list: { type: ordered ? "ol" : "ul", items }, next: i };
};

export const parseBlocks = (lines) => {
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^```/.test(line.trim())) {
      const lang = line.trim().slice(3).trim();
      i += 1;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: "code", lang, text: code.join("\n") });
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      blocks.push({
        type: "h",
        level,
        id: slugify(heading[2].replace(/[*`_]/g, "")),
        runs: parseInline(heading[2].trim()),
      });
      i += 1;
      continue;
    }

    if (/^([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoted = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", blocks: parseBlocks(quoted) });
      continue;
    }

    if (isListLine(line)) {
      const result = parseList(lines, i, listMarker(line).indent);
      blocks.push(result.list);
      i = result.next;
      continue;
    }

    if (/^!\[[^\]]*\]\([^)]+\)/.test(line.trim())) {
      const image = /^!\[([^\]]*)\]\(([^)\s]+)/.exec(line.trim());
      blocks.push({ type: "img", alt: image[1], src: image[2] });
      i += 1;
      continue;
    }

    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !isListLine(lines[i]) && !/^#{1,6}\s/.test(lines[i]) && !/^>/.test(lines[i]) && !/^```/.test(lines[i].trim())) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    if (paragraph.length) {
      blocks.push({ type: "p", runs: parseInline(paragraph.join(" ")) });
    } else {
      i += 1;
    }
  }

  return blocks;
};

const iconFromHtml = (html) => {
  const h1 = html.indexOf("<h1");
  if (h1 === -1) return null;
  const svgStart = html.indexOf("<svg", h1);
  const svgEnd = html.indexOf("</svg>", svgStart);
  if (svgStart === -1 || svgEnd === -1) return null;
  const svg = html.slice(svgStart, svgEnd + 6);
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const d = /<path[^>]*\sd="([^"]+)"/.exec(svg)?.[1];
  return viewBox && d ? { viewBox, path: d } : null;
};

const fetchText = async (url, attempts = 3) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return { text: await response.text(), status: response.status };
      if (response.status === 404) return { text: "", status: 404 };
    } catch (error) {
      if (attempt === attempts) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
  }
  return { text: "", status: 0 };
};

const mapLimit = async (items, limit, worker) => {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
};

const downloadImage = async (url, name) => {
  const response = await fetch(url);
  if (!response.ok) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(imageDir, { recursive: true });
  await fs.writeFile(path.join(imageDir, name), buffer);
  return `/sites/redlotusguide/pages/${name}`;
};

const main = async () => {
  const index = (await fetchText(`${origin}${site}/llms.txt`)).text;
  const entries = [...index.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)$/gm)].map(([, title, url]) => ({
    title,
    path: url.replace(origin, "").replace(/\.md$/, ""),
  }));
  console.log(`pages: ${entries.length}`);

  const imageMap = new Map();
  const pages = await mapLimit(entries, 5, async (entry, position) => {
    const [md, html] = await Promise.all([
      fetchText(`${origin}${entry.path}.md`),
      position < 60 || position % 1 === 0 ? fetchText(`${origin}${entry.path}`) : Promise.resolve({ text: "" }),
    ]);

    if (!md.text) {
      console.warn(`  missing markdown: ${entry.path}`);
      return null;
    }

    const body = normaliseListPrefixes(stripBoilerplate(md.text));
    const blocks = parseBlocks(body.split("\n"));

    const assets = [];
    for (const block of blocks) if (block.type === "img") assets.push(block);
    walkRuns(blocks, (run) => {
      if (run.img) assets.push(run);
    });

    for (const asset of assets) {
      if (!/^https?:/.test(asset.src ?? asset.img)) continue;
      const url = asset.src ?? asset.img;
      if (imageMap.has(url)) {
        const local = imageMap.get(url);
        if (asset.src) asset.src = local;
        if (asset.img) asset.img = local;
        continue;
      }
      const ext = /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.exec(url)?.[1] ?? "png";
      const name = `${slugify(path.basename(entry.path)) || "page"}-${imageMap.size + 1}.${ext}`;
      const local = await downloadImage(url, name);
      imageMap.set(url, local);
      if (local && asset.src) asset.src = local;
      if (local && asset.img) asset.img = local;
    }

    const route = entry.path.slice(site.length) || "/";
    const headings = blocks
      .filter((block) => block.type === "h" && block.level <= 3)
      .map((block) => ({
        id: block.id,
        text: block.runs.map((run) => run.v).join(""),
        level: block.level,
      }));

    return {
      route,
      source: entry.path,
      title: entry.title,
      icon: iconFromHtml(html.text),
      blocks,
      headings,
      order: position,
    };
  });

  const list = pages.filter(Boolean);
  console.log(`parsed: ${list.length}, images: ${imageMap.size}`);

  const byRoute = new Map(list.map((page) => [page.route, page]));
  const introRoute = "/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses";
  const introPage = byRoute.get(introRoute);
  if (introPage) {
    introPage.route = "/";
    byRoute.delete(introRoute);
    byRoute.set("/", introPage);
  }

  // Missing HTML icons: retry for pages where the h1 icon was empty.
  const missingIcons = list.filter((page) => !page.icon);
  await mapLimit(missingIcons, 5, async (page) => {
    const { text } = await fetchText(`${origin}${page.source}`);
    page.icon = iconFromHtml(text);
  });
  console.log(`icons: ${list.filter((page) => page.icon).length}/${list.length}`);

  // Point links at local routes when the target page was cloned, otherwise keep the source URL.
  const routes = new Set(list.map((page) => page.route));
  for (const page of list) {
    walkRuns(page.blocks, (run) => {
      if (!run.href || !run.href.startsWith("/")) return;
      const target = run.href.split("#")[0];
      if (routes.has(target)) return;
      run.href = `${origin}${site}${run.href}`;
    });
  }

  const data = { pages: Object.fromEntries(byRoute), order: list.map((page) => page.route) };
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(data, null, 2));
  const size = (await fs.stat(outFile)).size;
  console.log(`wrote ${path.relative(root, outFile)} (${(size / 1024).toFixed(1)} KB)`);

  const empty = list.filter((page) => page.blocks.length === 0);
  console.log(`pages with no content: ${empty.length}`);
  const listCount = list.reduce((sum, page) => sum + JSON.stringify(page.blocks).split('"type":"ul"').length - 1, 0);
  console.log(`lists: ${listCount}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
