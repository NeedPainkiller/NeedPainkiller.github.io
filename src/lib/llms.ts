/**
 * llms.txt (https://llmstxt.org) and its full-text companion, generated from published posts.
 */
import { absolute, asset, href } from './i18n';
import { getPosts, slugOf, type Post } from './posts';
import { isoDate } from './text';
import { SITE, type Lang } from '../site.config';

const LANG_LABEL: Record<Lang, string> = { ko: 'Korean', en: 'English' };

const postUrl = (lang: Lang, post: Post) => absolute(href(lang, `posts/${slugOf(post)}`));
/** Titles go inside Markdown link text, where unbalanced brackets would break the link. */
const linkText = (text: string) => text.replace(/[[\]]/g, (c) => `\\${c}`);

function postLines(lang: Lang, posts: Post[]): string {
  if (posts.length === 0) return '- No posts published yet.';
  return posts
    .map((p) => `- [${linkText(p.data.title)}](${postUrl(lang, p)}): ${p.data.description} (${isoDate(p.data.date)})`)
    .join('\n');
}

export async function llmsIndex(): Promise<string> {
  const [ko, en] = await Promise.all([getPosts('ko'), getPosts('en')]);
  return `# ${SITE.name}

> ${SITE.description.en} ${SITE.description.ko}

Personal engineering blog by ${SITE.author.name}. Korean pages live at the site root and English pages under /en/; a post that exists in both languages shares one slug and links to its translation.

## Posts (${LANG_LABEL.ko})

${postLines('ko', ko)}

## Posts (${LANG_LABEL.en})

${postLines('en', en)}

## About

- [소개 (Korean)](${absolute(href('ko', 'about'))}): who writes this blog
- [About (English)](${absolute(href('en', 'about'))}): who writes this blog
- [이력서 / Résumé](${absolute(href('ko', 'resume'))}): work history; English version at ${absolute(href('en', 'resume'))}
- [GitHub](${SITE.author.github})

## Optional

- [Full text of every post](${absolute(asset('llms-full.txt'))})
- [RSS (Korean)](${absolute(href('ko', 'rss.xml'))})
- [RSS (English)](${absolute(href('en', 'rss.xml'))})
- [Sitemap](${absolute(asset('sitemap-index.xml'))})
`;
}

export async function llmsFull(): Promise<string> {
  const [ko, en] = await Promise.all([getPosts('ko'), getPosts('en')]);
  const sections = ([['ko', ko], ['en', en]] as const).flatMap(([lang, posts]) =>
    posts.map(
      (p) => `# ${p.data.title}

- URL: ${postUrl(lang, p)}
- Language: ${LANG_LABEL[lang]}
- Published: ${isoDate(p.data.date)}${p.data.updated ? `\n- Updated: ${isoDate(p.data.updated)}` : ''}
- Topics: ${p.data.topics.join(', ')}${p.data.tags.length ? `\n- Tags: ${p.data.tags.join(', ')}` : ''}

${p.data.description}

${(p.body ?? '').trim()}
`,
    ),
  );
  const header = `# ${SITE.name}: full text

> Every published post on ${absolute(asset(''))}, in Markdown. Index: ${absolute(asset('llms.txt'))}
`;
  return [header, ...(sections.length ? sections : ['No posts published yet.\n'])].join('\n---\n\n');
}
