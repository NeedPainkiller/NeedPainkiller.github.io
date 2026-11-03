---
name: NeedPainkiller
description: A minimal bilingual engineering blog. One calm reading column, its code, and nothing that competes with them.
colors:
  paper: "#ffffff"
  paper-subtle: "#f5f6f8"
  paper-raised: "#ffffff"
  slate-ink: "#212b36"
  slate-heading: "#161d26"
  slate-muted: "#56606b"
  slate-faint: "#67707b"
  hairline: "#e7e9ec"
  hairline-strong: "#d4d8dd"
  cobalt: "#2851c6"
  cobalt-ink: "#ffffff"
  cobalt-wash: "#edf1fd"
  marker-yellow: "#fdeca2"
  code-paper: "#ffffff"
  code-line-tint: "#eef2fc"
  diff-add-tint: "#e8f6ed"
  diff-del-tint: "#fcecec"
  graphite: "#15171a"
  graphite-subtle: "#1c1f23"
  graphite-raised: "#1f2226"
  graphite-ink: "#dfe3e8"
  graphite-heading: "#f2f4f6"
  graphite-muted: "#a9b1bb"
  graphite-faint: "#949ca6"
  graphite-hairline: "#2a2e33"
  graphite-hairline-strong: "#3a3f46"
  periwinkle: "#8fa9ff"
  periwinkle-ink: "#0d1020"
  periwinkle-wash: "#1e2640"
  marker-ochre: "#5c4c12"
  graphite-code-paper: "#181b1f"
  graphite-code-line-tint: "#212a3e"
typography:
  display:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  display-mobile:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  statement:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  statement-mobile:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  headline-mobile:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  subhead:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.4
  subhead-mobile:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.4
  wordmark:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.78
    fontFeature: "'ss06'"
  ui:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'ss06'"
  secondary:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.14em"
  label-small:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.14em"
  meta:
    fontFamily: "Pretendard Variable, Pretendard, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, Pretendard Variable, monospace"
    fontSize: "13px"
    fontWeight: 400
  kbd:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, Pretendard Variable, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, Pretendard Variable, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  resume-name:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, Pretendard Variable, monospace"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  resume-name-mobile:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, Pretendard Variable, monospace"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
rounded:
  hairline: "3px"
  focus: "4px"
  inline: "5px"
  small: "6px"
  control: "8px"
  media: "10px"
  surface: "12px"
  sheet: "14px"
  pill: "999px"
spacing:
  gutter: "20px"
  column: "715px"
  column-en: "660px"
  rail: "216px"
  rail-gap: "56px"
components:
  search-trigger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.slate-faint}"
    rounded: "{rounded.control}"
    height: "34px"
    padding: "0 6px 0 10px"
  tool-button:
    backgroundColor: "transparent"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.control}"
    height: "34px"
    padding: "0 6px"
  tool-button-hover:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.slate-heading}"
  topic-filter:
    backgroundColor: "transparent"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 12px"
  topic-filter-active:
    backgroundColor: "{colors.slate-heading}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
  code-frame:
    backgroundColor: "{colors.code-paper}"
    textColor: "{colors.slate-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
  inline-code:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.slate-heading}"
    rounded: "{rounded.inline}"
    padding: "0.12em 0.4em"
  blockquote:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
  search-dialog:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.surface}"
    width: "600px"
  toc-pill:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.slate-heading}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 16px"
---

# Design System: NeedPainkiller

## Overview

**Creative North Star: "The Quiet Column"**

One engineer's notebook set as a single calm reading column. The post title, its date, the opening answer and the code arrive first; everything else (navigation, contents, tags, related posts) stays in slate greys at the edge of attention. The world is the category standard for a personal developer blog, executed at the craft level of kciter.so and gwagjiug.com, without irony and without smuggled quirks.

Density is low and rhythm is generous: a 715px column (660px for English), 72px above page heads, 96px between home sections, 112px before the footer. Structure is drawn with 1px hairlines, never with boxes or cards. Colour is almost entirely neutral; a single cobalt accent appears only when the reader acts (hover, focus, the contents item they are reading). Light is the base; a graphite dark mode follows the system preference unless the reader overrides it.

The build refuses hero banners, card grids, gradient chrome and decorative shadows. Every text token clears WCAG AA against both page grounds in its own theme; the meta and label greys are deliberately darker than the reference sites use.

**Key Characteristics:**
- One reading column with a sticky contents rail on wide screens.
- Pretendard for every word; JetBrains Mono only for code, dates, years and keyboard hints.
- Hairline rules (1px) separate rows, sections and footers; no cards.
- One cobalt accent, used only as a response to the reader.
- Flat surfaces; the search dialog is the only thing that casts a shadow.
- Lucide outline icons at stroke 1.75, plus the Simple Icons GitHub mark.

## Colors

A white-and-slate palette (graphite in dark mode) with one cobalt accent that only appears on interaction.

### Primary
- **Reader's Cobalt** (light `cobalt`, dark `periwinkle`): the only chromatic colour in the interface. Link and title colour on hover, the active contents item, the 2px focus outline, text selection (with `cobalt-ink` text), caret and native control accent, footnote reference and back-reference links, and the "copied" state of the code copy button. `cobalt-wash` / `periwinkle-wash` is the hover ground of the footnote back-reference.

### Secondary
- **Marker Yellow** (light `marker-yellow`, dark `marker-ochre`): highlighter for `<mark>` in prose and for matched terms in search result excerpts. Search highlights are yellow, not cobalt.

### Neutral
- **Paper / Graphite** (`paper`, `graphite`): page ground. `paper-raised` / `graphite-raised` is the ground of overlays (search dialog, mobile menu, contents sheet and pill).
- **Paper Subtle** (`paper-subtle`, `graphite-subtle`): blockquotes, inline code, keyboard hints, and the hover ground of icon buttons and search results.
- **Slate Heading** (`slate-heading`, `graphite-heading`): headings, post titles, wordmark, prose links at rest, bold text, the active topic filter fill.
- **Slate Ink** (`slate-ink`, `graphite-ink`): body text.
- **Slate Muted** (`slate-muted`, `graphite-muted`): nav links, descriptions, blockquote text, footnotes, icon buttons.
- **Slate Faint** (`slate-faint`, `graphite-faint`): dates, meta lines, counts, section headings, list markers, line numbers, the contents list at rest. Still AA.
- **Hairline** (`hairline`, `graphite-hairline`): row dividers, section and footer rules, table rows, inline-code border.
- **Hairline Strong** (`hairline-strong`, `graphite-hairline-strong`): control outlines (search trigger, topic filters, code frame, dialogs), table header rule, link underlines at rest, and the "·" separators.
- **Code tints** (`code-paper`, `code-line-tint`, `diff-add-tint`, `diff-del-tint` and dark twins): code frame ground, highlighted line (a faint cobalt tint), added and removed diff lines. Token colours come from Shiki's dual light/dark themes; the highlight line tint belongs to the system, not the syntax theme.

### Named Rules
**The Reader's Cobalt Rule.** Cobalt answers the reader: hover, focus, current position, selection, copy confirmation, footnote links. It never colours a resting heading, a button fill, a background panel or a decoration.

**The AA Floor Rule.** Every text colour, including faint meta, clears 4.5:1 against both `paper` and `paper-subtle` in its own theme. Do not lighten meta text to match the references.

## Typography

**Body Font:** Pretendard Variable (with Pretendard, system-ui, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic)
**Mono Font:** JetBrains Mono (with ui-monospace, SFMono-Regular, Menlo, Consolas, then Pretendard for Hangul)

**Character:** One neutral grotesque carries every word in both languages, tuned with stylistic set `ss06`; the mono is a precise secondary voice for code and for numbers that should line up. Korean text uses `word-break: keep-all`; numerals in dates, code and counts are tabular.

### Hierarchy
- **Display** (700, 32px, 1.3, -0.02em; 27px under 640px): post and page titles.
- **Home statement** (600, 28px, 1.45, -0.02em, max 22em; 23px mobile): the single intro statement on the home page.
- **Headline** (700, 24px, 1.35, -0.015em; 21px mobile): prose h2. Prose h3 is 700 at 19px (18px mobile), h4 700 at 17px.
- **Title** (600, 17px, 1.45, -0.01em): post-list and timeline item titles. Compact lists drop to 500 at 16px.
- **Wordmark** (700, 19px, -0.02em, slate heading): the site name in the header; shares its size with prose h3.
- **Body** (400, 17px, 1.78; 16px / 1.75 mobile): post prose in a 715px (KO) or 660px (EN) column. UI text is 16px / 1.6.
- **Meta** (400, 14px, slate faint): meta lines, counts, footer, captions. Secondary descriptions run at 15px in slate muted.
- **Secondary** (400, 15px, slate muted): post-list and timeline descriptions, header nav links, search result titles (600), mobile contents sheet items, tables, the résumé role line and its pending-data note. Year headings also sit at 15px, in mono (see Mono).
- **Label** (700, 13px, 0.14em, uppercase; 0.04em in Korean): index section headings such as "Recent posts" and "Read next", and the contents title at 12px. These are the headings themselves, never a line placed above another heading.
- **Mono** (400, 13px; 12.5px in dense meta): dates, year headings (500, 15px), keyboard hints. **Code** (400, 14px, 1.7; 13px mobile) in frames; inline code at 0.84em.
- **Small** (11.5px and 12px): keyboard hint chips (`⌘K`, `Esc`) in mono at 11.5px; the search dialog footer hint at 12px in slate faint; the contents title as the 12px Label.

### Named Rules
**The Mono Is For Machines Rule.** Mono sets only code, dates, years, counts and keyboard hints. Prose, navigation, titles and buttons are Pretendard.

**The Résumé Exception.** The standalone Résumé page deliberately breaks the mono rule, following kciter's Résumé. English is set all-mono at 13.5px / 1.7. Korean prose is set in Pretendard at 14.5px, because Hangul inside a mono stack falls back to a proportional face but keeps monospace word gaps; the name (700, 44px, -0.04em; 34px under 640px), dates, stacks and URLs stay mono in both languages. The exception is scoped to that page and is not a licence for mono elsewhere.

**The Upright Caption Rule.** Pretendard has no italic, so Markdown `*…*` captions after an image are set upright (no synthetic slant), centred, 14px, slate faint, 8px below the image.

## Layout

A single centred column: `min(100% - 40px, 715px)`, narrowing to 660px when the document language is English. Posts use a three-track grid (gutter, column, gutter); from 1260px a sticky contents rail (216px plus a 56px gap, hairline on its left edge, sticky at 40px) sits in the right track. Below 1260px the rail disappears and a floating "contents" pill opens a bottom sheet instead. Below 760px the header collapses: nav moves into a menu popover and the search field becomes an icon button. Below 640px titles and prose step down one size and code frames bleed to the screen edge.

Vertical rhythm is generous and fixed in px: header 36px from the top (14px mobile); 72px above post and list heads (40px mobile); 88px above the home intro; 96px between home sections (72px mobile); 56px between year groups; 64px before the post footer, 72px before comments, 88px before related posts, 112px before the site footer. Prose blocks are spaced at 1.25em; h2 opens with 2.4em above.

Lists of posts are hairline-separated rows on a grid: a 104px mono date column, the title and two-line description, and an optional 112x63 thumbnail. On mobile the date drops below the title.

### Named Rules
**The Title-First Rule.** Dates and metadata follow the title, never precede it. On narrow screens the date moves under the title rather than above it as a label.

**The Trailing Separator Rule.** In wrapping meta lines the "·" separator (hairline strong) is attached to the end of the item before it, so a wrapped line never begins with a dot.

## Elevation & Depth

The system is flat. Depth comes from tonal grounds (`paper-subtle` for blockquotes, inline code and hover states; `paper-raised` for overlays) and from 1px rules, never from shadows. Overlays (mobile menu, contents sheet and pill) are separated by a hairline-strong border and, where modal, a scrim.

### Shadow Vocabulary
- **Dialog lift** (`0 24px 48px -16px rgb(22 29 38 / 0.28), 0 2px 6px rgb(22 29 38 / 0.08)`; dark: `0 24px 48px -16px rgb(0 0 0 / 0.6), 0 2px 6px rgb(0 0 0 / 0.3)`): the search dialog only.

### Named Rules
**The One Shadow Rule.** The search dialog is the only element with a shadow. Everything else is flat at rest and on hover.

## Shapes

Gently rounded and consistent. Controls, code frames, blockquotes, images and search results share an 8px radius; overlays (search dialog, mobile menu) take 12px and the contents sheet 14px. Inline code and keyboard keys use 5px, keyboard hints and focus rings 4px, marks 3px, post-list thumbnails 6px and the post thumbnail 10px. Fully rounded shapes are reserved for the topic filters, the contents pill, scrollbar thumbs and timeline dots. Borders are always 1px (keyboard keys carry a 2px bottom edge). Images are framed by a hairline, not a shadow.

## Components

### Header and Navigation
Quiet and left-to-right: wordmark (700, 19px, slate heading) at the left, then text links (15px, slate muted) for Posts, Timeline, About and Résumé, then tools. Hover and the current page turn slate heading; the current page is also 600. Nav hover deliberately does not use cobalt. Icon and language buttons are 34px squares, transparent, 8px radius, filling with `paper-subtle` on hover. On mobile a menu button opens a 300px popover (12px radius, hairline-strong border, raised ground).

### Search
- **Trigger:** a 34px outlined field (hairline-strong border, 8px radius) with a search icon, a faint label and a keyboard hint chip (`⌘K` / `Ctrl K`, mono, 11.5px, subtle ground, 4px radius). Hover darkens the border to slate faint.
- **Dialog:** 600px wide, 12px radius, raised ground, the system's only shadow, entering over 220ms with a 10px rise and slight scale on `cubic-bezier(0.16, 1, 0.3, 1)`. A 56px borderless input at 17px; results are 8px-radius rows (600 title, two-line muted excerpt) that fill `paper-subtle` on hover or focus; matched terms are marked in marker yellow.

### Post List
Hairline-separated rows. The whole row is the title's link; hovering anywhere turns the title cobalt. Dates are mono 13px slate faint. Compact variant (related posts) tightens padding to 14px.

### Topic Filter (archive)
Rounded pills (32px tall, 0 12px, 999px radius, hairline-strong border, 14px slate muted, count in tabular figures at 12.5px). Hover darkens border and text. The active filter is filled: slate heading background and border, page-ground text.

### Code Frame
A 1px hairline-strong frame, 8px radius, on `code-paper`. A 38px caption bar in mono 12.5px carries the file name (500, slate heading), the language (lowercase, faint, right-aligned) and a ghost "copy" button (sans 12.5px, 28px tall, 6px radius) that turns cobalt once copied. Line numbers are faint and unselectable; highlighted lines use the cobalt-tinted line ground; diffs use green and red tints. Mobile frames bleed to the screen edge with no radius or side borders.

### Prose Elements
- **Links:** slate heading with a hairline-strong underline (1px, offset 0.22em); on hover the text and underline turn cobalt.
- **Heading anchors:** a faint "#" appears in the left margin on hover or focus (hidden on mobile).
- **Blockquote:** a subtle-ground panel, 8px radius, 16px 20px, slate muted at 16px. No left bar.
- **Figures:** images centred with an 8px radius; in-body images link to the full-size file with a zoom-in cursor. Captions follow the Upright Caption Rule.
- **Tables:** hairline rows, a hairline-strong header rule, 15px tabular figures, horizontal scroll when wide.
- **Footnotes:** a hairline-ruled section at 14.5px slate muted. References and the back-reference are cobalt; the back-reference is a Lucide arrow-up icon in a 22px target that takes the cobalt wash on hover.

### Contents (table of contents)
On wide screens a sticky rail with a hairline left edge: a 12px uppercase title, items at 13.5px slate faint (sub-items 13px, indented 12px). Hover goes to slate heading; the item being read is cobalt and 600. Narrower screens get a fixed 40px pill (999px, hairline-strong border, raised ground) that opens a bottom sheet.

### Timeline
A hairline-strong vertical rule with 10px circular nodes: hollow for events, filled slate faint for posts. Titles are 17px 600, turning cobalt on hover; mono dates follow the title.

### Résumé
A standalone 800px page without the site header: a small back/print bar, the mono name, then sections headed by 14.5px bold labels over a hairline, each entry on a 150px date column plus content grid. The type follows the Résumé Exception. A print stylesheet hides the bar, forces a black-on-white palette, sets 10pt body and 26pt name, 16mm x 14mm margins and keeps entries unbroken.

### Icons
Lucide outline icons with the stroke normalised to 1.75, default 18px, inheriting `currentColor`; the GitHub mark from Simple Icons is the only filled icon. Icons are inline SVG, never glyphs or icon fonts.

## Do's and Don'ts

### Do:
- **Do** keep every surface flat and separate content with 1px hairlines (`hairline`, `hairline-strong`).
- **Do** reserve cobalt for reader responses: hover, focus (2px outline, 3px offset), the active contents item, selection, footnote links, copy confirmation and the code highlight line tint.
- **Do** set dates and metadata after the title, with "·" separators trailing their item.
- **Do** use JetBrains Mono only for code, dates, years, counts and keyboard hints; the Résumé page is the one documented exception.
- **Do** keep every text colour at WCAG AA or better in both themes.
- **Do** use Lucide outline icons at stroke 1.75 and the Simple Icons GitHub mark, as inline SVG.
- **Do** set Markdown image captions upright, centred, 14px and slate faint.
- **Do** honour `prefers-reduced-motion`; transitions are 120ms ease-out colour changes, and only the search dialog animates its entrance.

### Don't:
- **Don't** put an eyebrow, kicker or small label above a heading. Index section headings are the headings themselves.
- **Don't** add shadows to anything but the search dialog.
- **Don't** use cards, hero banners, card grids or gradient chrome.
- **Don't** use cobalt as a resting colour for headings, buttons, fills or decoration.
- **Don't** set prose in mono outside the Résumé page, and don't put Korean prose in mono even there.
- **Don't** apply synthetic italic to Pretendard.
- **Don't** lighten meta text below AA to match the reference sites.
- **Don't** copy the references' identity: their names, text, images, logos or signature ornaments.
