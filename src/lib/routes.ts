import { allTags, getPosts, postsByTopic, slugOf } from './posts';
import { otherLang, tagSlug } from './text';
import { TOPICS, type Lang } from '../site.config';

export async function postPaths(lang: Lang) {
  const posts = await getPosts(lang);
  return posts.map((post) => ({ params: { slug: slugOf(post) }, props: { post } }));
}

export async function topicPaths(lang: Lang) {
  const posts = await getPosts(lang);
  return TOPICS.map((topic) => ({ params: { topic }, props: { topic, posts: postsByTopic(posts, topic) } }));
}

export async function tagPaths(lang: Lang) {
  const posts = await getPosts(lang);
  const otherTags = new Set(allTags(await getPosts(otherLang(lang))).map((t) => t.slug));
  return allTags(posts).map(({ tag, slug }) => ({
    params: { tag: slug },
    props: {
      tag,
      posts: posts.filter((p) => p.data.tags.some((t) => tagSlug(t) === slug)),
      inOther: otherTags.has(slug),
    },
  }));
}
