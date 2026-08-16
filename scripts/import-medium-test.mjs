import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { cleanExportMarkdown, importMedium } from "./import-medium.mjs";

test("cleans Medium export wrappers and duplicate captions", () => {
  const markdown = `A teaser.

* * *

### Test post

Article body.

![Image](/image.jpg)

Image caption

*Image caption*

By [Oskari Okko Ojala](https://medium.com/@okko) on January 2, 2025.

[Canonical link](https://medium.com/p/abcdef123456)

Exported from [Medium](https://medium.com) on August 16, 2026.`;

  assert.equal(
    cleanExportMarkdown(markdown),
    `Article body.

![Image](/image.jpg)

*Image caption*`
  );
});

test("imports a Medium HTML export with local images", async () => {
  const root = await mkdtemp(join(tmpdir(), "medium-import-test-"));
  const posts = join(root, "export", "posts");
  const outputDir = join(root, "output");
  const imageDir = join(root, "images");
  const redirectDir = join(root, "redirects");

  try {
    await mkdir(posts, { recursive: true });
    await writeFile(
      join(posts, "2025-01-02-Test-post-abcdef123456.html"),
      `<!doctype html><html><head>
        <meta property="article:published_time" content="2025-01-02T10:30:00Z">
        <meta property="article:tag" content="Astro">
        <meta name="description" content="A test description.">
        <link rel="canonical" href="https://medium.com/@okko/test-post-abcdef123456">
      </head><body><article><h1>Test post</h1><p>Hello <strong>world</strong>.</p>
        <figure><img alt="Pixel" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="><figcaption>One pixel</figcaption></figure>
      </article></body></html>`,
      "utf8"
    );

    const results = await importMedium({
      source: join(root, "export"),
      outputDir,
      imageDir,
      redirectDir,
      dryRun: false,
    });
    assert.equal(results.length, 1);
    assert.equal(results[0].slug, "test-post-abcdef123456");

    const markdown = await readFile(join(outputDir, "test-post-abcdef123456.md"), "utf8");
    assert.match(markdown, /pubDatetime: 2025-01-02T10:30:00\.000Z/);
    assert.match(markdown, /tags: \["Astro"\]/);
    assert.match(markdown, /Hello \*\*world\*\*\./);
    assert.match(markdown, /\/images\/posts\/test-post-abcdef123456-01-[a-f\d]{10}\.png/);
    assert.match(markdown, /\*One pixel\*/);
    assert.equal((await readdir(imageDir)).length, 1);
    const redirect = await readFile(join(redirectDir, "test-post-abcdef123456", "index.html"), "utf8");
    assert.match(redirect, /url=\/posts\/test-post-abcdef123456\//);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("does not replace an existing imported post", async () => {
  const root = await mkdtemp(join(tmpdir(), "medium-import-test-"));
  const posts = join(root, "export", "posts");
  const outputDir = join(root, "output");
  const imageDir = join(root, "images");
  const redirectDir = join(root, "redirects");
  const sourcePost = join(posts, "2025-01-02-Test-post-abcdef123456.html");
  const importedPost = join(outputDir, "test-post-abcdef123456.md");

  try {
    await mkdir(posts, { recursive: true });
    await writeFile(
      sourcePost,
      `<!doctype html><html><head>
        <meta property="article:published_time" content="2025-01-02T10:30:00Z">
        <link rel="canonical" href="https://medium.com/@okko/test-post-abcdef123456">
      </head><body><article><h1>Test post</h1><p>Original content.</p></article></body></html>`,
      "utf8"
    );

    const options = {
      source: join(root, "export"),
      outputDir,
      imageDir,
      redirectDir,
      dryRun: false,
    };
    await importMedium(options);
    await writeFile(importedPost, "Keep my edits.\n", "utf8");

    await assert.rejects(importMedium(options), /No posts could be imported/);
    assert.equal(await readFile(importedPost, "utf8"), "Keep my edits.\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});