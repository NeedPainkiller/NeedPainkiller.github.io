import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang, Topic } from '../site.config';
import { pickRelated, readingMinutes, tagSlug } from './text';

export type Post = CollectionEntry<'posts'>;

/** Drafts render in `astro dev` and in QA builds run with SHOW_DRAFTS=1; never in a normal build. */
export const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';

export const slugOf = (post: Post): string => post.id.split('/')[0]!;
export const langOf = (post: Post): Lang => post.id.split('/')[1] as Lang;
export const minutesOf = (post: Post): number => readingMinutes(post.body ?? '');

export async function getPosts(lang?: Lang): Promise<Post[]> {
  const all = await getCollection('posts', (p: Post) => SHOW_DRAFTS || !p.data.draft);
  return all
    .filter((p: Post) => !lang || langOf(p) === lang)
    .sort((a: Post, b: Post) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getTranslation(post: Post): Promise<Post | undefined> {
  const other = await getPosts(langOf(post) === 'ko' ? 'en' : 'ko');
  return other.find((p) => slugOf(p) === slugOf(post));
}

export function relatedPosts(post: Post, pool: Post[], count = 3): Post[] {
  const view = (p: Post) => ({ id: p.id, date: p.data.date, topics: p.data.topics, tags: p.data.tags.map(tagSlug), post: p });
  return pickRelated(view(post), pool.map(view), count).map((v) => v.post);
}

export function postsByTopic(posts: Post[], topic: Topic): Post[] {
  return posts.filter((p) => p.data.topics.includes(topic));
}

export function allTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, { tag: string; slug: string; count: number }>();
  for (const p of posts) {
    for (const tag of p.data.tags) {
      const slug = tagSlug(tag);
      const hit = map.get(slug) ?? { tag, slug, count: 0 };
      hit.count += 1;
      map.set(slug, hit);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
