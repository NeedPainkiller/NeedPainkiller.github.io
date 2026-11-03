---
version: 1
slug: "src-layouts-postlayout-astro"
primary_target: "src/layouts/PostLayout.astro"
related_targets: ["src/layouts/BaseLayout.astro","src/views","src/pages"]
---

## Scope

Post page (anchor surface) and every surface that inherits its system: home, posts archive, topic and tag lists, timeline, about, resume, search, 404. Visitor mode: Read.

## Audience and job

Developers arriving from search on one post want the answer and runnable code fast; evaluators skim About and Resume; the author re-finds old posts through search, topics and the yearly archive. Korean at the root, English under /en/.

## Constraints

Astro 7 static output under base /my-blog/. Content is Markdown in git; no fabricated posts, metrics or résumé facts. WCAG 2.2 AA including meta text and labels. Pages read correctly without JavaScript. Quality bar: kciter.so and gwagjiug.com; their identity marks are never copied.

## Direction contract

THESIS: A minimal personal engineering blog executed at the craft level of kciter.so and gwagjiug.com: one calm reading column where the answer and its code come first, refusing the template-blog arrangement of hero banners, card grids and gradient chrome.

OWN-WORLD: White ground and a graphite dark mode; slate ink in two strengths, both AA; one cobalt accent reserved for links on hover, the active contents item and focus. Pretendard for every word, a monospace only for code and dates. Hairline rules instead of boxes; wide uppercase section headings; code in a 1px-ruled frame with file name, language and line numbers. No shadows except the search dialog.

STORY: The reader sees title, date, reading time and the opening answer in the first viewport, jumps through the right-hand contents, copies the code, then follows a related post or the topic. Evaluators reach About and Resume from the header in one click.

FIRST VIEWPORT: Header with wordmark left; Posts, Timeline, About, a search field showing ⌘K, language and theme controls right. A centred 715px column with a 200px sticky contents rail beside it. Title 32px bold, meta line of date, reading time, topics and the KO/EN switch, an optional 16:9 thumbnail, then the lead paragraph.

FORM: The category standard, chosen by the author on the decision page over the assigned and pick directions (option 1 of 1 for canon). seed:65739897f4eda29d

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

The ⌘K search dialog: one authored motion (fade and slight rise from an already-visible scrim), results in the reader's language with the matched term marked.

## Unresolved (decide in build, never invent)

Exact accent value within cobalt; monospace face; home composition (intro plus recent posts plus topics); thumbnail aspect fixed at 16:9 unless content argues otherwise.
