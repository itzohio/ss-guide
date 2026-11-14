/**
 * Pre-translates the cloned guide into French and writes
 * src/content/redlotusguide/pages.fr.json (mirrors pages.json).
 *
 * Run with: node scripts/translate-redlotus-pages.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normaliseListPrefixes, parseBlocks } from "./fetch-redlotus-pages.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = path.join(root, "src/content/redlotusguide/pages.json");
const outFile = path.join(root, "src/content/redlotusguide/pages.fr.json");
const cacheFile = path.join(root, "src/content/redlotusguide/translations.json");

const ENDPOINT = "https://translate.googleapis.com/translate_a/single";

// The guide's French copy keeps the English term "screenshare" instead of "partage d'écran".
const TERMS = [
  [/\bcontrôles de piratage\b/gi, "hack checks"],
  [/\bcontrôle de piratage\b/gi, "hack check"],
  [/\bpartages d[’']écran\b/gi, "screenshares"],
  [/\bpartage d[’']écran\b/gi, "screenshare"],
  [/\bpartage de l[’']écran\b/gi, "screenshare"],
];

// Written French from the MT engine sounds like an administrative report; keep it conversational.
const TONE = [
  [/\bPar conséquent\b/g, "Du coup"],
  [/\bpar conséquent\b/g, "du coup"],
  [/\bCependant\b(?! que)/g, "Mais"],
  [/\bcependant\b(?! que)/g, "mais"],
  [/\b(Toutefois|Néanmoins)\b/g, "Mais"],
  [/\b(toutefois|néanmoins)\b/g, "mais"],
  [/\bPar ailleurs\b/g, "Aussi"],
  [/\bpar ailleurs\b/g, "aussi"],
  [/\bAu sein de l[’']/g, "Dans l'"],
  [/\bau sein de l[’']/g, "dans l'"],
  [/\bAu sein du\b/g, "Dans le"],
  [/\bau sein du\b/g, "dans le"],
  [/\bAu sein de la\b/g, "Dans la"],
  [/\bau sein de la\b/g, "dans la"],
  [/\bAu sein des\b/g, "Dans les"],
  [/\bau sein des\b/g, "dans les"],
  [/\bAu sein de\b/g, "Dans"],
  [/\bau sein de\b/g, "dans"],
  [/\bafin d[’']/g, "pour "],
  [/\bAfin d[’']/g, "Pour "],
  [/\bafin de\b/g, "pour"],
  [/\bAfin de\b/g, "Pour"],
  [/\bdans le but de\b/g, "pour"],
  [/\bDans le but de\b/g, "Pour"],
  [/\bde manière à\b/g, "pour"],
  [/\bIl s[’']agit d[’']/g, "C'est "],
  [/\bil s[’']agit d[’']/g, "c'est "],
  [/\bIl s[’']agit de\b/g, "C'est"],
  [/\bil s[’']agit de\b/g, "c'est"],
  [/\bEffectuer\b/g, "Faire"],
  [/\beffectuer\b/g, "faire"],
  [/\beffectuées\b/g, "faites"],
  [/\beffectués\b/g, "faits"],
  [/\beffectuée\b/g, "faite"],
  [/\beffectué\b/g, "fait"],
  [/\bNotamment\b/g, "Surtout"],
  [/\bnotamment\b/g, "surtout"],
  [/\best cruciale\b/g, "compte vraiment"],
  [/\best crucial\b/g, "compte vraiment"],
  [/\bEst cruciale?\b/g, "Compte vraiment"],
  [/\bIl est (important|essentiel) de\b/g, "Il faut"],
  [/\bil est (important|essentiel) de\b/g, "il faut"],
  [/\bL[’']objectif est de\b/g, "Le but, c'est de"],
  [/\bl[’']objectif est de\b/g, "le but, c'est de"],
  [/\bS[’']avère\b/g, "Est"],
  [/\bs[’']avère\b/g, "est"],
];

const applyTone = (text) => TONE.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);

const applyTerms = (text) => {
  let value = text;
  for (const [pattern, word] of TERMS) {
    value = value.replace(pattern, () => word);
  }
  return applyTone(value);
};
const MAX_CHARS = 2600;

const cache = JSON.parse(await fs.readFile(cacheFile, "utf8").catch(() => "{}"));
for (const key of Object.keys(cache)) cache[key] = applyTerms(cache[key]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const translateBatch = async (lines, attempt = 1) => {
  const query = lines.join("\n");
  const url = `${ENDPOINT}?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const text = (data[0] ?? []).map((part) => part[0]).join("");
    const out = text.split("\n");
    if (out.length !== lines.length) throw new Error(`line mismatch ${out.length}/${lines.length}`);
    return out;
  } catch (error) {
    if (attempt >= 4) throw error;
    await sleep(600 * attempt);
    return translateBatch(lines, attempt + 1);
  }
};

const needsTranslation = (text) => {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  if (!/[a-z]{2}/i.test(trimmed)) return false;
  return true;
};

const collect = (blocks, out) => {
  for (const block of blocks) {
    if (block.runs) block.runs.forEach((run) => {
      if (run.img || run.c || !needsTranslation(run.v)) return;
      out.add(run.v.trim());
    });
    if (block.type === "quote") collect(block.blocks, out);
    if (block.items) {
      for (const item of block.items) {
        item.runs.forEach((run) => {
          if (run.img || run.c || !needsTranslation(run.v)) return;
          out.add(run.v.trim());
        });
        item.children.forEach((child) => collect([child], out));
      }
    }
  }
};

const main = async () => {
  const data = JSON.parse(await fs.readFile(sourceFile, "utf8"));
  const pages = data.pages;

  const strings = new Set();
  for (const page of Object.values(pages)) {
    if (needsTranslation(page.title)) strings.add(page.title.trim());
    page.headings.forEach((heading) => {
      if (needsTranslation(heading.text)) strings.add(heading.text.trim());
    });
    collect(page.blocks, strings);
  }

  const pending = [...strings].filter((text) => !cache[text]);
  console.log(`strings: ${strings.size}, cached: ${strings.size - pending.length}, pending: ${pending.length}`);

  let batch = [];
  let chars = 0;
  const batches = [];
  for (const text of pending) {
    if (chars + text.length + 1 > MAX_CHARS && batch.length) {
      batches.push(batch);
      batch = [];
      chars = 0;
    }
    batch.push(text);
    chars += text.length + 1;
  }
  if (batch.length) batches.push(batch);

  let done = 0;
  for (const lines of batches) {
    try {
      const translated = await translateBatch(lines);
      lines.forEach((line, index) => {
        cache[line] = applyTerms(translated[index]);
      });
    } catch (error) {
      console.warn(`  batch failed (${lines.length} lines): ${error.message}`);
      // Google sometimes merges or splits lines; retry this batch one string at a time.
      for (const line of lines) {
        try {
          const [translated] = await translateBatch([line]);
          cache[line] = applyTerms(translated);
        } catch (lineError) {
          console.warn(`    line failed: ${line.slice(0, 40)} (${lineError.message})`);
        }
        await sleep(120);
      }
    }
    done += 1;
    if (done % 10 === 0) {
      await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2));
      process.stdout.write(`  ${done}/${batches.length} batches\n`);
    }
    await sleep(120);
  }

  await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2));

  const tr = (text) => {
    if (!needsTranslation(text)) return text;
    const value = cache[text.trim()];
    if (!value) return text;
    const leading = text.match(/^\s*/)[0];
    const trailing = text.match(/\s*$/)[0];
    return `${leading}${applyTerms(value)}${trailing}`;
  };

  const translateRuns = (runs) =>
    runs.map((run) => {
      if (run.img || run.c || !needsTranslation(run.v)) return run;
      if (run.v.includes("\n")) {
        return { ...run, v: run.v.split("\n").map((line) => (needsTranslation(line) ? tr(line) : line)).join("\n") };
      }
      return { ...run, v: tr(run.v) };
    });

  const translateBlocks = (blocks) =>
    blocks.map((block) => {
      if (block.runs) return { ...block, runs: translateRuns(block.runs) };
      if (block.type === "quote") return { ...block, blocks: translateBlocks(block.blocks) };
      if (block.items) {
        return {
          ...block,
          items: block.items.map((item) => ({
            runs: translateRuns(item.runs),
            children: translateBlocks(item.children),
          })),
        };
      }
      return block;
    });

  const french = {};
  let missing = 0;
  for (const [route, page] of Object.entries(pages)) {
    const title = tr(page.title);
    if (title === page.title && needsTranslation(page.title)) missing += 1;
    french[route] = {
      title,
      blocks: translateBlocks(page.blocks),
      headings: page.headings.map((heading) => ({ ...heading, text: tr(heading.text) })),
    };
  }

  // Hand-written French pages override the machine translation for their route.
  const overrideDir = path.join(root, "src/content/redlotusguide/fr");
  const overrideFiles = (await fs.readdir(overrideDir).catch(() => [])).filter((name) => name.endsWith(".md"));
  let overrides = 0;

  for (const file of overrideFiles) {
    const raw = await fs.readFile(path.join(overrideDir, file), "utf8");
    const route = /^<!--\s*route:\s*(\S+)\s*-->/.exec(raw)?.[1];
    if (!route) {
      console.warn(`  override without a route comment: ${file}`);
      continue;
    }
    const body = raw.replace(/^<!--[\s\S]*?-->/, "").trim();
    const blocks = parseBlocks(normaliseListPrefixes(body).split("\n"));
    const [first, ...rest] = blocks;
    const isTitle = first?.type === "h" && first.level === 1;
    const title = isTitle ? first.runs.map((run) => run.v).join("") : french[route]?.title ?? route;
    const content = isTitle ? rest : blocks;

    french[route] = {
      title,
      blocks: content,
      headings: content
        .filter((block) => block.type === "h" && block.level >= 2 && block.level <= 3)
        .map((block) => ({ id: block.id, text: block.runs.map((run) => run.v).join(""), level: block.level })),
    };
    overrides += 1;
  }

  console.log(`hand-written French pages: ${overrides}`);

  await fs.writeFile(outFile, JSON.stringify({ pages: french }, null, 2));
  const size = (await fs.stat(outFile)).size;
  console.log(`wrote ${path.relative(root, outFile)} (${(size / 1024).toFixed(1)} KB)`);
  console.log(`untranslated titles: ${missing}`);
};

await main();
