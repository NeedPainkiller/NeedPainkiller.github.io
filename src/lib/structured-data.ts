/**
 * schema.org JSON-LD builders. Pure functions over plain values so they can be unit-tested.
 * Only facts the site actually has are emitted: no ratings, no search action (site search is a
 * client-side dialog without a URL), no organisation the author has not confirmed.
 */
import { SITE } from '../site.config';

type Lang = 'ko' | 'en';
type Node = Record<string, unknown>;

const LOCALE: Record<Lang, string> = { ko: 'ko-KR', en: 'en-US' };

export const LD_IDS = {
  person: `${SITE.origin}/#person`,
  website: `${SITE.origin}/#website`,
} as const;

export function graph(...nodes: Node[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function personLd(aboutUrl: string): Node {
  return {
    '@type': 'Person',
    '@id': LD_IDS.person,
    name: SITE.author.name,
    url: aboutUrl,
    sameAs: [SITE.author.github],
  };
}

export function websiteLd(homeUrl: string): Node {
  return {
    '@type': 'WebSite',
    '@id': LD_IDS.website,
    url: homeUrl,
    name: SITE.name,
    description: SITE.description.ko,
    inLanguage: [LOCALE.ko, LOCALE.en],
    publisher: { '@id': LD_IDS.person },
  };
}

export function profilePageLd(input: { url: string; lang: Lang; name: string }): Node {
  return {
    '@type': 'ProfilePage',
    url: input.url,
    name: input.name,
    inLanguage: LOCALE[input.lang],
    isPartOf: { '@id': LD_IDS.website },
    mainEntity: { '@id': LD_IDS.person },
  };
}

export interface PostingInput {
  url: string;
  lang: Lang;
  title: string;
  description: string;
  published: Date;
  modified?: Date;
  image: string;
  topics: readonly string[];
  tags: readonly string[];
  /** Absolute URL of the same post in the other language, when it exists. */
  translationUrl?: string;
}

export function blogPostingLd(p: PostingInput): Node {
  return {
    '@type': 'BlogPosting',
    '@id': `${p.url}#article`,
    url: p.url,
    mainEntityOfPage: p.url,
    headline: p.title,
    description: p.description,
    inLanguage: LOCALE[p.lang],
    datePublished: p.published.toISOString(),
    dateModified: (p.modified ?? p.published).toISOString(),
    image: p.image,
    author: { '@id': LD_IDS.person, name: SITE.author.name, url: SITE.author.github },
    publisher: { '@id': LD_IDS.person },
    isPartOf: { '@id': LD_IDS.website },
    articleSection: [...p.topics],
    keywords: [...p.tags],
    ...(p.translationUrl ? { workTranslation: { '@type': 'BlogPosting', url: p.translationUrl } } : {}),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** JSON for an inline <script>: "<" is escaped so content can never close the tag. */
export function serializeLd(data: Node): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
