/**
 * Pure helpers with no Astro imports, so they can be unit-tested directly.
 */
export type Lang = 'ko' | 'en';

/** Join a base path ("/my-blog" or "/my-blog/") with a site path, keeping directory URLs slash-terminated. */
export function joinBase(base: string, path = ''): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  const out = b + path.replace(/^\/+/, '');
  if (out.endsWith('/') || /[?#]/.test(out) || /\.[a-z0-9]{2,5}$/i.test(out)) return out;
  return `${out}/`;
}

/** Korean lives at the root, English under /en/. */
export function localePath(base: string, lang: Lang, path = ''): string {
  const p = path.replace(/^\/+/, '');
  return joinBase(base, lang === 'en' ? `en/${p}` : p);
}

export function otherLang(lang: Lang): Lang {
  return lang === 'ko' ? 'en' : 'ko';
}

const HANGUL = /[ㄱ-ㆎ가-힣]/g;
const LATIN_WORD = /[A-Za-z0-9][A-Za-z0-9'’_.-]*/g;
const FENCE = /^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm;

/**
 * Reading time in whole minutes for mixed Korean/English Markdown.
 * Hangul is counted per syllable (~500/min), Latin per word (~230/min),
 * code per line (~60/min), because readers slow down on code.
 */
export function readingMinutes(markdown: string): number {
  const blocks = markdown.match(FENCE) ?? [];
  const codeLines = blocks.reduce((n, block) => n + Math.max(0, block.split('\n').length - 2), 0);
  const prose = markdown
    .replace(FENCE, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ');
  const hangul = (prose.match(HANGUL) ?? []).length;
  const words = (prose.match(LATIN_WORD) ?? []).length;
  return Math.max(1, Math.round(hangul / 500 + words / 230 + codeLines / 60));
}

/** ISO calendar date (YYYY-MM-DD) in UTC, so frontmatter dates never shift with the build machine's zone. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export interface Relatable {
  id: string;
  date: Date;
  topics: readonly string[];
  tags: readonly string[];
}

/** Shared tags weigh more than shared topics; ties go to the newer post. */
export function relatedScore(a: Relatable, b: Relatable): number {
  const tags = b.tags.filter((t) => a.tags.includes(t)).length;
  const topics = b.topics.filter((t) => a.topics.includes(t)).length;
  return tags * 3 + topics * 2;
}

export function pickRelated<T extends Relatable>(target: T, pool: readonly T[], count = 3): T[] {
  return pool
    .filter((p) => p.id !== target.id)
    .map((p) => ({ p, score: relatedScore(target, p) }))
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score || y.p.date.getTime() - x.p.date.getTime())
    .slice(0, count)
    .map(({ p }) => p);
}

export function groupByYear<T>(items: readonly T[], dateOf: (item: T) => Date): { year: number; items: T[] }[] {
  const map = new Map<number, T[]>();
  for (const item of items) {
    const year = dateOf(item).getUTCFullYear();
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, list]) => ({ year, items: [...list].sort((x, y) => dateOf(y).getTime() - dateOf(x).getTime()) }));
}
