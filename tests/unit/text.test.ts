import { describe, expect, it } from 'vitest';
import {
  groupByYear,
  isoDate,
  joinBase,
  localePath,
  otherLang,
  pickRelated,
  readingMinutes,
  tagSlug,
} from '../../src/lib/text';

describe('joinBase', () => {
  it('joins with or without a trailing slash on the base', () => {
    expect(joinBase('/my-blog', 'posts')).toBe('/my-blog/posts/');
    expect(joinBase('/my-blog/', '/posts/')).toBe('/my-blog/posts/');
  });
  it('keeps files and fragments as they are', () => {
    expect(joinBase('/my-blog/', 'rss.xml')).toBe('/my-blog/rss.xml');
    expect(joinBase('/my-blog/', 'pagefind/pagefind.js')).toBe('/my-blog/pagefind/pagefind.js');
    expect(joinBase('/my-blog/', 'posts/a/#intro')).toBe('/my-blog/posts/a/#intro');
  });
  it('returns the base itself for the root', () => {
    expect(joinBase('/my-blog/', '')).toBe('/my-blog/');
    expect(joinBase('/', '')).toBe('/');
  });
});

describe('localePath', () => {
  it('puts Korean at the root and English under /en/', () => {
    expect(localePath('/my-blog/', 'ko', 'posts/x')).toBe('/my-blog/posts/x/');
    expect(localePath('/my-blog/', 'en', 'posts/x')).toBe('/my-blog/en/posts/x/');
    expect(localePath('/my-blog/', 'en')).toBe('/my-blog/en/');
  });
  it('flips languages', () => {
    expect(otherLang('ko')).toBe('en');
    expect(otherLang('en')).toBe('ko');
  });
});

describe('readingMinutes', () => {
  it('never reports less than a minute', () => {
    expect(readingMinutes('짧은 글')).toBe(1);
  });
  it('counts Hangul syllables at about 500 per minute', () => {
    expect(readingMinutes('가'.repeat(2500))).toBe(5);
  });
  it('counts English words at about 230 per minute', () => {
    expect(readingMinutes('word '.repeat(1150))).toBe(5);
  });
  it('reads code by line, not by token, and ignores link URLs', () => {
    const code = ['```js', ...Array.from({ length: 120 }, () => 'const a = b;'), '```'].join('\n');
    expect(readingMinutes(code)).toBe(2);
    expect(readingMinutes('[링크](https://example.com/' + 'x'.repeat(5000) + ')')).toBe(1);
  });
});

describe('dates and tags', () => {
  it('formats dates in UTC so frontmatter days never shift', () => {
    expect(isoDate(new Date('2026-11-03'))).toBe('2026-11-03');
  });
  it('slugs tags without dropping Hangul', () => {
    expect(tagSlug(' 장애 분석 ')).toBe('장애-분석');
    expect(tagSlug('HikariCP')).toBe('hikaricp');
  });
});

describe('pickRelated', () => {
  const post = (id: string, date: string, topics: string[], tags: string[]) => ({
    id,
    date: new Date(date),
    topics,
    tags,
  });
  const target = post('a', '2026-01-01', ['backend'], ['jpa', 'db']);
  const pool = [
    target,
    post('topic-only', '2026-03-01', ['backend'], []),
    post('two-tags', '2025-01-01', ['infra'], ['jpa', 'db']),
    post('one-tag-old', '2024-01-01', ['backend'], ['jpa']),
    post('one-tag-new', '2026-02-01', ['backend'], ['jpa']),
    post('unrelated', '2026-04-01', ['ai'], ['llm']),
  ];

  it('ranks shared tags above shared topics and breaks ties by recency', () => {
    expect(pickRelated(target, pool, 4).map((p) => p.id)).toEqual([
      'two-tags',
      'one-tag-new',
      'one-tag-old',
      'topic-only',
    ]);
  });
  it('excludes the post itself and anything unrelated', () => {
    const ids = pickRelated(target, pool, 10).map((p) => p.id);
    expect(ids).not.toContain('a');
    expect(ids).not.toContain('unrelated');
  });
});

describe('groupByYear', () => {
  it('groups newest year first with newest items first', () => {
    const items = ['2025-03-01', '2026-01-02', '2026-05-01'].map((d) => ({ d: new Date(d) }));
    const groups = groupByYear(items, (i) => i.d);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
    expect(groups[0]!.items.map((i) => isoDate(i.d))).toEqual(['2026-05-01', '2026-01-02']);
  });
});
