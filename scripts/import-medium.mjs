#!/usr/bin/env node
/* eslint-disable no-console */

import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import unzipper from "unzipper";

const DEFAULT_POSTS_DIR = resolve("src/content/posts");
const DEFAULT_IMAGES_DIR = resolve("public/images/posts");
const DEFAULT_REDIRECTS_DIR = resolve("public");

function usage() {
  console.log(`Usage: npm run import:medium -- <export.zip|export-directory> [options]

Options:
  --output-dir <path>  Markdown destination (default: src/content/posts)
  --image-dir <path>   Downloaded image destination (default: public/images/posts)
  --redirect-dir <path> Old-URL redirects destination (default: public)
  --dry-run            Parse and report without writing files
  --help               Show this help

Request a Medium export from Settings > Security and apps > Download your information.
The importer reads the export's posts/*.html files and will not replace existing files.`);
}

function parseArgs(argv) {
  const options = {
    source: undefined,
    outputDir: DEFAULT_POSTS_DIR,
    imageDir: DEFAULT_IMAGES_DIR,
    redirectDir: DEFAULT_REDIRECTS_DIR,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") return { ...options, help: true };
    if (argument === "--dry-run") {
      options.dryRun = true;
    } else if (["--output-dir", "--image-dir", "--redirect-dir"].includes(argument)) {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a path`);
      const optionName = {
        "--output-dir": "outputDir",
        "--image-dir": "imageDir",
        "--redirect-dir": "redirectDir",
      }[argument];
      options[optionName] = resolve(value);
      index += 1;
    } else if (argument.startsWith("--")) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (!options.source) {
      options.source = resolve(argument);
    } else {
      throw new Error(`Unexpected argument: ${argument}`);
    }
  }

  return options;
}

async function findHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(path)));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === ".html") files.push(path);
  }
  return files;
}

async function readZipPosts(zipPath, directory) {
  const archive = await unzipper.Open.file(zipPath);
  const htmlEntries = archive.files.filter(
    entry => entry.type === "File" && extname(entry.path).toLowerCase() === ".html"
  );
  const postEntries = htmlEntries.filter(entry => entry.path.split(/[\\/]/).includes("posts"));
  const entries = postEntries.length ? postEntries : htmlEntries;

  await mkdir(directory, { recursive: true });
  const paths = [];
  for (const entry of entries) {
    const path = join(directory, basename(entry.path));
    await writeFile(path, await entry.buffer());
    paths.push(path);
  }
  return paths;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
}

function mediumId(fileName, html) {
  return (
    fileName.match(/[-_]([a-f\d]{12})(?:\.html)?$/i)?.[1] ??
    html.match(/medium\.com\/(?:p\/|[^"'\s]*-)([a-f\d]{12})(?:[?"'\s/]|$)/i)?.[1]
  );
}

function canonicalSlug($, id) {
  const canonical = $("link[rel='canonical']").attr("href");
  if (!canonical || !id) return undefined;
  try {
    const segment = decodeURIComponent(new URL(canonical).pathname.split("/").filter(Boolean).at(-1) ?? "");
    return segment.toLowerCase().endsWith(id.toLowerCase()) ? segment : undefined;
  } catch {
    return undefined;
  }
}

function getDate($, fileName, property, fallback) {
  const value = $(`meta[property='${property}']`).attr("content");
  if (value && !Number.isNaN(Date.parse(value))) return new Date(value).toISOString();
  const fileDate = fileName.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (fileDate) return new Date(`${fileDate}T12:00:00.000Z`).toISOString();
  return fallback;
}

function descriptionFor($, body) {
  const meta = $("meta[name='description']").attr("content")?.trim();
  const paragraph = body.find("p").first().text().trim();
  const value = meta || paragraph || "Imported from Medium.";
  return value.length > 240 ? `${value.slice(0, 237).trimEnd()}...` : value;
}

function imageExtension(url, contentType) {
  const types = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["image/gif", ".gif"],
    ["image/webp", ".webp"],
    ["image/avif", ".avif"],
  ]);
  const normalizedType = contentType?.split(";", 1)[0].toLowerCase();
  if (types.has(normalizedType)) return types.get(normalizedType);
  try {
    const extension = extname(new URL(url).pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"].includes(extension)) {
      return extension === ".jpeg" ? ".jpg" : extension;
    }
  } catch {
    // The fetch below will provide the useful error for an invalid URL.
  }
  return ".jpg";
}

async function localizeImages($, body, slug, imageDir, dryRun) {
  const images = body.find("img").toArray();
  const warnings = [];

  for (let index = 0; index < images.length; index += 1) {
    const image = $(images[index]);
    const url = image.attr("data-src") || image.attr("src");
    if (!url || url.includes("medium.com/_/stat") || url.startsWith("/")) {
      if (url?.includes("medium.com/_/stat")) image.remove();
      continue;
    }

    try {
      const response = await fetch(url, { headers: { "User-Agent": "okko.eu Medium export importer" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
      const fileName = `${slug}-${String(index + 1).padStart(2, "0")}-${hash}${imageExtension(
        url,
        response.headers.get("content-type")
      )}`;
      if (!dryRun) await writeFile(join(imageDir, fileName), bytes, { flag: "wx" });
      image.attr("src", `/images/posts/${fileName}`);
      image.removeAttr("data-src data-image-id data-width data-height");
    } catch (error) {
      warnings.push(`Could not download ${url}: ${error.message}`);
    }
  }

  return warnings;
}

async function assertAvailable(path, description) {
  try {
    await readFile(path);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  throw new Error(`${description} already exists: ${path}`);
}

function createTurndown() {
  const turndown = new TurndownService({
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    headingStyle: "atx",
  });
  turndown.keep(["iframe"]);
  turndown.addRule("figcaption", {
    filter: "figcaption",
    replacement(content) {
      return content.trim() ? `\n\n*${content.trim()}*\n\n` : "";
    },
  });
  turndown.addRule("figure", {
    filter: "figure",
    replacement(content) {
      return `\n\n${content.trim()}\n\n`;
    },
  });
  return turndown;
}

export function cleanExportMarkdown(markdown) {
  let lines = markdown.split("\n");
  const hasExportFooter = lines.some(line => /^Exported from \[Medium\]/.test(line.trim()));

  if (hasExportFooter) {
    const wrapperEnd = lines.findIndex(line => line.trim() === "* * *");
    if (wrapperEnd !== -1) lines = lines.slice(wrapperEnd + 1);

    while (!lines[0]?.trim()) lines.shift();
    if (lines[0]?.startsWith("### ")) lines.shift();

    const footerStart = lines.findIndex(line =>
      /^(?:By \[.+\]\(https:\/\/medium\.com\/@|\[Canonical link\]|\[View original\.\]|Exported from \[Medium\])/.test(
        line.trim()
      )
    );
    if (footerStart !== -1) lines = lines.slice(0, footerStart);
  }

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("![")) continue;
    const captionIndex = lines.findIndex((line, lineIndex) => lineIndex > index && line.trim());
    if (captionIndex === -1 || lines[captionIndex].trim().startsWith("![")) continue;
    const italicIndex = lines.findIndex(
      (line, lineIndex) => lineIndex > captionIndex && line.trim()
    );
    if (italicIndex === -1) continue;
    const caption = lines[captionIndex].trim();
    if (lines[italicIndex].trim() === `*${caption}*`) {
      lines.splice(captionIndex, italicIndex - captionIndex);
    }
  }

  return lines.join("\n").trim();
}

async function writeRedirect(slug, redirectDir, dryRun) {
  if (dryRun) return;
  const encodedSlug = encodeURIComponent(slug);
  const target = `/posts/${encodedSlug}/`;
  const directory = join(redirectDir, slug);
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="https://okko.eu${target}">
    <title>Moved to ${target}</title>
  </head>
  <body><p>This article moved to <a href="${target}">${target}</a>.</p></body>
</html>
`,
    { encoding: "utf8", flag: "wx" }
  );
}

async function convertPost(filePath, options) {
  const html = await readFile(filePath, "utf8");
  const $ = cheerio.load(html);
  const fileName = basename(filePath, extname(filePath));
  const id = mediumId(fileName, html);
  const title = $("h1").first().text().trim() || $("title").text().replace(/\s*[|–-]\s*Medium\s*$/i, "").trim();
  if (!title) throw new Error("No title found");

  const body = $("article").first().length
    ? $("article").first()
    : $(".section-content").first().length
      ? $(".section-content").first()
      : $("body").first();
  body.find("script, style, noscript, nav").remove();
  body.find("h1").first().remove();
  body.find("img[src*='medium.com/_/stat']").remove();
  body.find("p").filter((_, element) => /was originally published in .* on Medium/i.test($(element).text())).remove();

  const slug = canonicalSlug($, id) || `${slugify(title)}${id ? `-${id.toLowerCase()}` : ""}`;
  const published = getDate($, fileName, "article:published_time");
  const modified = getDate($, fileName, "article:modified_time");
  const tags = [
    ...$("meta[property='article:tag']")
      .map((_, element) => $(element).attr("content")?.trim())
      .get(),
    ...($("meta[name='keywords']").attr("content")?.split(",").map(tag => tag.trim()) ?? []),
  ].filter((tag, index, all) => tag && all.indexOf(tag) === index);

  const outputPath = join(options.outputDir, `${slug}.md`);
  const redirectPath = join(options.redirectDir, slug, "index.html");
  if (!options.dryRun) {
    await assertAvailable(outputPath, "Post");
    await assertAvailable(redirectPath, "Redirect");
  }

  const warnings = await localizeImages($, body, slug, options.imageDir, options.dryRun);
  const markdown = cleanExportMarkdown(
    createTurndown().turndown(body.html() ?? "").replace(/\u00a0/g, " ").trim()
  );
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(descriptionFor($, body))}`,
    `pubDatetime: ${published ?? new Date().toISOString()}`,
    ...(modified && modified !== published ? [`modDatetime: ${modified}`] : []),
    ...(!published ? ["draft: true"] : []),
    `tags: ${JSON.stringify(tags)}`,
    "---",
  ].join("\n");

  if (!options.dryRun) {
    await writeFile(outputPath, `${frontmatter}\n\n${markdown}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
  }
  await writeRedirect(slug, options.redirectDir, options.dryRun);
  return { slug, title, warnings };
}

export async function importMedium(options) {
  let extractionDirectory;
  let sourceDirectory = options.source;
  let files;
  if (extname(options.source).toLowerCase() === ".zip") {
    extractionDirectory = await mkdtemp(join(tmpdir(), "medium-export-"));
    files = await readZipPosts(options.source, extractionDirectory);
  }

  try {
    if (!files) {
      const allHtml = await findHtmlFiles(sourceDirectory);
      const postFiles = allHtml.filter(file => file.split(/[\\/]/).includes("posts"));
      files = postFiles.length ? postFiles : allHtml;
    }
    if (!files.length) throw new Error("No HTML posts found in the Medium export");
    if (!options.dryRun) {
      await mkdir(options.outputDir, { recursive: true });
      await mkdir(options.imageDir, { recursive: true });
    }

    const results = [];
    for (const file of files.sort()) {
      try {
        const result = await convertPost(file, options);
        results.push(result);
        console.log(`${options.dryRun ? "Would import" : "Imported"}: ${result.title} -> ${result.slug}`);
        result.warnings.forEach(warning => console.warn(`  Warning: ${warning}`));
      } catch (error) {
        console.error(`Skipped ${file}: ${error.message}`);
      }
    }
    if (!results.length) throw new Error("No posts could be imported");
    return results;
  } finally {
    if (extractionDirectory) await rm(extractionDirectory, { recursive: true, force: true });
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) usage();
    else if (!options.source) {
      usage();
      process.exitCode = 1;
    } else {
      const results = await importMedium(options);
      console.log(`\n${options.dryRun ? "Validated" : "Imported"} ${results.length} post(s).`);
    }
  } catch (error) {
    console.error(`Medium import failed: ${error.message}`);
    process.exitCode = 1;
  }
}