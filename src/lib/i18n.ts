import { SITE, type Lang, type Topic } from '../site.config';
import { joinBase, localePath } from './text';

const BASE = import.meta.env.BASE_URL ?? '/';

/** Site-internal URL for a language, base-aware and slash-terminated. */
export const href = (lang: Lang, path = ''): string => localePath(BASE, lang, path);

/** URL for a static asset or language-neutral file under the base. */
export const asset = (path: string): string => joinBase(BASE, path);

/** Absolute URL for canonical/OG/RSS use. */
export const absolute = (pathname: string): string => new URL(pathname, SITE.origin).toString();

const TOPIC_NAMES: Record<Lang, Record<Topic, string>> = {
  ko: { backend: '백엔드', frontend: '프론트엔드', infra: '인프라', ai: 'AI' },
  en: { backend: 'Backend', frontend: 'Frontend', infra: 'Infra', ai: 'AI' },
};

const KIND_NAMES = {
  ko: { post: '글', career: '경력', project: '프로젝트', talk: '발표', writing: '집필', site: '사이트', note: '메모' },
  en: { post: 'Post', career: 'Career', project: 'Project', talk: 'Talk', writing: 'Writing', site: 'Site', note: 'Note' },
} as const;

export type TimelineKind = keyof (typeof KIND_NAMES)['ko'];

const STRINGS = {
  ko: {
    langName: '한국어',
    skip: '본문으로 건너뛰기',
    posts: '글',
    allPosts: '전체 글',
    recentPosts: '최근 글',
    timeline: '타임라인',
    about: '소개',
    resume: '이력서',
    topics: '주제',
    tags: '태그',
    search: '검색',
    searchPlaceholder: '글 검색',
    searchHint: '↑↓ 이동 · Enter 열기 · Esc 닫기',
    searchEmpty: '맞는 글이 없습니다.',
    searchIdle: '제목, 본문, 코드까지 찾습니다.',
    searchUnavailable: '검색 색인은 사이트를 빌드할 때 만들어집니다.',
    menu: '메뉴',
    close: '닫기',
    themeToggle: '다크 모드 전환',
    contents: '목차',
    updated: '수정',
    minutes: (n: number) => `${n}분`,
    postCount: (n: number) => `${n}편`,
    related: '함께 읽기',
    comments: '댓글',
    copy: '복사',
    copied: '복사됨',
    copyLabel: '코드 복사',
    anchorLabel: '이 제목으로 연결되는 링크',
    writtenBy: '글쓴이',
    readIn: 'English',
    onlyIn: '이 글은 한국어로만 있습니다.',
    noPosts: '아직 공개된 글이 없습니다.',
    noPostsHint: '첫 글이 올라오면 여기에 보입니다.',
    noTimeline: '아직 기록이 없습니다.',
    viewAll: '모두 보기',
    print: '인쇄 · PDF로 저장',
    backToSite: '블로그로 돌아가기',
    notFound: '페이지를 찾을 수 없습니다',
    notFoundBody: '주소가 바뀌었거나 없는 페이지입니다.',
    home: '홈',
    rss: 'RSS 피드',
    footnotes: '각주',
    resumeSections: {
      experience: '경력',
      projects: '프로젝트',
      openSource: '오픈소스',
      talks: '발표',
      publications: '출판',
      skills: '기술',
      education: '학력',
    },
    present: '현재',
    resumePending: '이력은 정리하고 있습니다. 그동안의 작업은 GitHub에서 볼 수 있습니다.',
  },
  en: {
    langName: 'English',
    skip: 'Skip to content',
    posts: 'Posts',
    allPosts: 'All posts',
    recentPosts: 'Recent posts',
    timeline: 'Timeline',
    about: 'About',
    resume: 'Resume',
    topics: 'Topics',
    tags: 'Tags',
    search: 'Search',
    searchPlaceholder: 'Search posts',
    searchHint: '↑↓ to move · Enter to open · Esc to close',
    searchEmpty: 'No posts match.',
    searchIdle: 'Searches titles, text and code.',
    searchUnavailable: 'The search index is generated when the site is built.',
    menu: 'Menu',
    close: 'Close',
    themeToggle: 'Toggle dark mode',
    contents: 'Contents',
    updated: 'Updated',
    minutes: (n: number) => `${n} min read`,
    postCount: (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    related: 'Related posts',
    comments: 'Comments',
    copy: 'Copy',
    copied: 'Copied',
    copyLabel: 'Copy code',
    anchorLabel: 'Link to this heading',
    writtenBy: 'Written by',
    readIn: '한국어',
    onlyIn: 'This post is available in English only.',
    noPosts: 'No posts yet.',
    noPostsHint: 'New posts will appear here.',
    noTimeline: 'Nothing recorded yet.',
    viewAll: 'View all',
    print: 'Print · Save as PDF',
    backToSite: 'Back to the blog',
    notFound: 'Page not found',
    notFoundBody: 'The address may have changed, or the page never existed.',
    home: 'Home',
    rss: 'RSS feed',
    footnotes: 'Footnotes',
    resumeSections: {
      experience: 'Experience',
      projects: 'Projects',
      openSource: 'Open source',
      talks: 'Talks',
      publications: 'Publications',
      skills: 'Skills',
      education: 'Education',
    },
    present: 'Present',
    resumePending: 'The full résumé is still being written up. Meanwhile, my work is on GitHub.',
  },
} as const;

export const ui = (lang: Lang) => STRINGS[lang];
export const topicName = (lang: Lang, topic: Topic) => TOPIC_NAMES[lang][topic];
export const kindName = (lang: Lang, kind: TimelineKind) => KIND_NAMES[lang][kind];
