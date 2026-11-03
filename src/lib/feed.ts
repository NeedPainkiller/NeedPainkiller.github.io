import rss from '@astrojs/rss';
import { absolute, href } from './i18n';
import { getPosts, slugOf } from './posts';
import { SITE, type Lang } from '../site.config';

export async function feed(lang: Lang): Promise<Response> {
  const posts = await getPosts(lang);
  return rss({
    title: `${SITE.name} (${lang === 'ko' ? '한국어' : 'English'})`,
    description: SITE.description[lang],
    site: absolute(href(lang)),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: absolute(href(lang, `posts/${slugOf(post)}`)),
      categories: [...post.data.topics, ...post.data.tags],
    })),
    customData: `<language>${lang === 'ko' ? 'ko-KR' : 'en-US'}</language>`,
  });
}
