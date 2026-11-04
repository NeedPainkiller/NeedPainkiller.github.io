import { describe, expect, it } from 'vitest';
import {
  LD_IDS,
  blogPostingLd,
  breadcrumbLd,
  graph,
  personLd,
  serializeLd,
  websiteLd,
} from '../../src/lib/structured-data';

const base = {
  url: 'https://needpainkiller.github.io/posts/a/',
  lang: 'ko' as const,
  title: '제목',
  description: '요약',
  published: new Date('2026-11-03'),
  image: 'https://needpainkiller.github.io/og-default.png',
  topics: ['백엔드'],
  tags: ['jpa'],
};

describe('blogPostingLd', () => {
  it('uses ISO dates, the page locale and the shared author node', () => {
    const ld = blogPostingLd({ ...base, modified: new Date('2026-11-10') });
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.datePublished).toBe('2026-11-03T00:00:00.000Z');
    expect(ld.dateModified).toBe('2026-11-10T00:00:00.000Z');
    expect(ld.inLanguage).toBe('ko-KR');
    expect(ld.author).toMatchObject({ '@id': LD_IDS.person });
    expect(ld.isPartOf).toEqual({ '@id': LD_IDS.website });
  });
  it('falls back to the publish date when the post was never updated', () => {
    expect(blogPostingLd(base).dateModified).toBe('2026-11-03T00:00:00.000Z');
  });
  it('links a translation only when one exists', () => {
    expect(blogPostingLd(base)).not.toHaveProperty('workTranslation');
    const withEn = blogPostingLd({ ...base, translationUrl: 'https://needpainkiller.github.io/en/posts/a/' });
    expect(withEn.workTranslation).toMatchObject({ url: 'https://needpainkiller.github.io/en/posts/a/' });
  });
});

describe('site graph', () => {
  it('ties the website and the person together by @id', () => {
    const g = graph(websiteLd('https://needpainkiller.github.io/'), personLd('https://needpainkiller.github.io/about/'));
    expect(g['@context']).toBe('https://schema.org');
    const [site, person] = g['@graph'] as Record<string, unknown>[];
    expect(site!.publisher).toEqual({ '@id': person!['@id'] });
    expect(person!.sameAs).toEqual(['https://github.com/NeedPainkiller']);
  });
  it('numbers breadcrumb positions from one', () => {
    const crumbs = breadcrumbLd([
      { name: '홈', url: 'https://x/' },
      { name: '글', url: 'https://x/posts/' },
    ]).itemListElement as { position: number }[];
    expect(crumbs.map((c) => c.position)).toEqual([1, 2]);
  });
});

describe('serializeLd', () => {
  it('escapes "<" so post text can never close the script tag', () => {
    const out = serializeLd({ headline: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out).headline).toBe('</script><script>alert(1)</script>');
  });
});
