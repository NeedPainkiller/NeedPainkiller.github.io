# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro static site. Posts and pages are Markdown (MDX only when a post needs an interactive demo) stored in this repository and versioned with git. There is no database. The build outputs plain static HTML/CSS plus small progressive-enhancement scripts.

- History: the author first chose plain hand-written HTML/CSS. On 2026-11-03 they required posts to live as Markdown files in git, which needs a build step, and chose Astro (the stack both reference sites use).
- Hosting: GitHub Pages via GitHub Actions from the user-site repository `NeedPainkiller/NeedPainkiller.github.io` (renamed from `my-blog` on 2026-11-04), served at the domain root `https://needpainkiller.github.io/` (base path `/`), so root-level files such as robots.txt take effect. A custom domain may come later; origin and base are configured in one place.
- JavaScript is allowed only for progressive enhancement: search, theme toggle, code copy, table-of-contents state, comments. Every page reads correctly without it.

## Users

- **Developers looking for an answer.** Engineers who usually arrive from a search engine on a single post about a specific problem: a tutorial, a debugging write-up, a deep dive. They want the explanation and the working code, then they leave or follow a related link.
- **People evaluating the author.** Hiring managers, recruiters, clients and potential collaborators who want to see how the author thinks and works. They skim the writing, the projects and the resume.
- **The author, later.** The blog is also the author's own searchable archive. They come back to find an old fix, command or explanation.

## Product Purpose

A personal technical blog by one engineer. It exists for three confirmed reasons:

1. **Career visibility:** a public, durable record of the author's expertise and way of working.
2. **Knowledge base:** an archive where past posts stay findable. Retrieval matters more than traffic.
3. **Writing practice:** a low-pressure place to publish regularly and get better at technical writing.

Success means steady publishing, posts that can still be found and used months later, and a site the author can point to when someone asks what they can do.

Growing a large readership was offered as a goal and **not** selected. Subscriber counts and audience growth are not success measures.

## Positioning

The writing of one engineer working across the whole stack (backend/server, frontend/web, infra/DevOps and AI/data), published in both Korean and English. This isn't a single-topic niche blog, a team blog or a news aggregator. Its distinguishing claim is one author's first-hand breadth.

## Operating Context

- The author writes a post as a Markdown file, previews it locally, commits and pushes; GitHub Actions builds and deploys.
- Readers land on individual post pages directly from search more often than through the home page.
- Technical posts contain code blocks, terminal commands and configuration snippets that readers copy and run.
- Evaluators reach the About and Resume pages from the blog and judge the author by them.
- Post length varies from short notes to long deep dives. Thumbnails exist only for some posts.

## Capabilities and Constraints

- **Bilingual content:** Korean and English are both first-class. Korean lives at the site root, English under `/en/`. A post is one folder (`src/content/posts/<slug>/`) holding `ko.md`, `en.md` or both; a translation is the sibling file and shares the slug. Each language can exist alone.
- **Topics:** four fixed areas — backend, frontend, infra, ai — plus free-form tags.
- **v1 features (confirmed):** full-text search on ⌘K (static index), giscus comments (stored in GitHub Discussions, mapped per page path), dark mode with a toggle, Timeline page, table of contents, code blocks with line numbers/filename/copy, tags, footnotes, related posts, reading time, per-language RSS, sitemap.
- **About and Resume:** About is prose-first Markdown. Resume is structured data per language rendered as a standalone page with a print stylesheet; sections without data are hidden.
- **Terminology:** "post" is a single article. "Projects" and "resume" are the career-visibility material.

## Brand Commitments

- **Display name:** `NeedPainkiller` (GitHub `github.com/NeedPainkiller`).
- **Binding references:** the site's structure and feature set follow `https://kciter.so/` and `https://www.gwagjiug.com/`; About and Resume follow kciter.so's About and Résumé pages. Resemblance to these references is acceptable to the author.
- **Visual direction (standing preference, chosen 2026-11-03):** the category standard — a minimal personal developer blog — executed at the craft level of those two sites, without irony or smuggled quirks.
- Never copy the references' identity: their names, text, images, logos, signature ornaments (e.g. kciter's ASCII art hero or "devlog" label) or comment system.
- The author's logo exists but is not in the repository yet.
- Things the author rejected as outcomes: a generic template blog, an over-decorated portfolio, a stiff documentation site.

## Evidence on Hand

- **Posts:** none yet. Do not invent posts, titles, dates or reading stats as if they were real. Development fixtures must be marked draft and never ship.
- **Projects / resume:** exist, but are not yet in the repository. Use only what the author supplies; never invent projects, employers, roles, dates, metrics or tech stacks.
- **Name / logo:** name confirmed (above); logo and avatar pending.
- **Absent and not to be fabricated:** testimonials, follower or subscriber counts, view counts, press mentions, employer logos, endorsements.

## Product Principles

1. **Findable later beats new today.** Every post should be reachable again by topic, date, language and search. The archive is a tool, not a feed.
2. **The code is the content.** Readers come for working explanations and runnable snippets, so technical material must be legible, accurate and easy to copy.
3. **Two languages, one author.** Korean and English readers each get a complete experience; neither language is an afterthought.
4. **Real work only.** Career visibility rests on the author's actual projects and writing. Nothing is padded, inflated or invented.
5. **Publishing stays cheap.** Adding a post is writing one Markdown file and pushing; everything else is generated.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast at least 4.5:1 (including meta text and labels the references set lighter), visible focus, keyboard-operable search and table of contents, `lang` set per page and per language switch, reduced-motion respected.
