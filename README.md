# Okko.eu

The personal blog of Oskari Okko Ojala, built with [Astro](https://astro.build/), [AstroPaper](https://github.com/satnaing/astro-paper), and GitHub Pages.

## Local development

Requires Node.js 24 (the GitHub workflows use Node 24).

```sh
npm ci
npm run dev
```

Run all project checks with:

```sh
npm run test:import
npm run lint
npm run format:check
npm run build
```

## Migrate from Medium

Medium RSS usually exposes only the latest 10 posts. Use a Medium export to migrate the complete archive:

1. In Medium, open **Settings > Security and apps > Download your information**.
2. Request the export and download the ZIP from the email Medium sends.
3. Check what the importer finds without writing anything:

   ```sh
   npm run import:medium -- ~/Downloads/medium-export.zip --dry-run
   ```

4. Import all posts and images:

   ```sh
   npm run import:medium -- ~/Downloads/medium-export.zip
   ```

5. Review the generated Markdown in `src/content/posts/` and images in `public/images/posts/`.
6. Run `npm run build`, then inspect the site with `npm run dev`.

The importer is intentionally non-destructive. It refuses to replace an existing generated post or redirect, uses the original Medium slug and ID where available, removes Medium tracking pixels and boilerplate, and downloads images into this repository. New post URLs use AstroPaper's `/posts/<slug>/` format. Static pages at the old root-level Medium URLs redirect visitors to the new URLs.

HTML-to-Markdown conversion cannot perfectly reproduce every Medium embed. Check complex tables, code blocks, videos, and third-party embeds after importing.

## Publish on GitHub Pages

Create an empty public repository named `okko.eu-blog` in the `okko` GitHub account. Do not initialize it with another README or license. Then run:

```sh
git branch -M main
git remote add origin git@github.com:okko/okko.eu-blog.git
git add .
git commit -m "Set up Astro blog and Medium importer"
git push -u origin main
```

In **Repository settings > Pages**, select **GitHub Actions** as the source. The workflow in `.github/workflows/deploy.yml` publishes every push to `main`.

## Configure okko.eu and HTTPS

Before changing DNS, add `okko.eu` under **GitHub account settings > Pages > Add a domain** and create the TXT verification record GitHub provides. This protects the domain from takeover.

At the DNS provider, remove records that currently point the apex domain to Medium and add these GitHub Pages records:

| Type | Name | Value                 |
| ---- | ---- | --------------------- |
| A    | `@`  | `185.199.108.153`     |
| A    | `@`  | `185.199.109.153`     |
| A    | `@`  | `185.199.110.153`     |
| A    | `@`  | `185.199.111.153`     |
| AAAA | `@`  | `2606:50c0:8000::153` |
| AAAA | `@`  | `2606:50c0:8001::153` |
| AAAA | `@`  | `2606:50c0:8002::153` |
| AAAA | `@`  | `2606:50c0:8003::153` |

The repository already contains `public/CNAME` with `okko.eu`. Review the production build locally and wait for the GitHub Pages workflow to succeed before changing DNS. After DNS propagation, verify that **Repository settings > Pages > Custom domain** shows `okko.eu`. Wait for GitHub to issue the TLS certificate, then enable **Enforce HTTPS**.

This is a project repository with its own `CNAME`; it does not assign `okko.eu` to the `okko.github.io` user-site repository or to any other repository.
