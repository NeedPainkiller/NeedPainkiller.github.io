/**
 * Single source of truth for site-wide constants.
 * Changing `base` (e.g. to '/' for a custom domain) is the only edit needed to move the site.
 */
export const SITE = {
  name: 'NeedPainkiller',
  origin: 'https://needpainkiller.github.io',
  base: '/my-blog',
  repo: 'https://github.com/NeedPainkiller/my-blog',
  defaultLang: 'ko',
  description: {
    ko: 'NeedPainkiller의 개발 노트. 백엔드, 프론트엔드, 인프라, AI를 다룹니다.',
    en: 'Engineering notes by NeedPainkiller on backend, frontend, infra and AI.',
  },
  author: {
    name: 'NeedPainkiller',
    github: 'https://github.com/NeedPainkiller',
  },
  /**
   * giscus (GitHub Discussions) comments. Fill repoId/categoryId from https://giscus.app
   * after enabling Discussions on the repository. While either is empty, the comment
   * section is not rendered.
   */
  giscus: {
    repo: 'NeedPainkiller/my-blog',
    repoId: '',
    category: 'Comments',
    categoryId: '',
  },
} as const;

export type Lang = 'ko' | 'en';
export const LANGS: readonly Lang[] = ['ko', 'en'];

export const TOPICS = ['backend', 'frontend', 'infra', 'ai'] as const;
export type Topic = (typeof TOPICS)[number];
