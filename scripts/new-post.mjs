#!/usr/bin/env node
/**
 * Scaffold a new post.
 *
 *   npm run new-post -- <slug> [--lang ko|en|both] [--topic backend|frontend|infra|ai]
 *
 * Creates src/content/posts/<slug>/<lang>.md with draft: true. Never overwrites a file.
 */
import fs from 'node:fs';
import path from 'node:path';

const TOPICS = ['backend', 'frontend', 'infra', 'ai'];
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new-post -- <slug> [--lang ko|en|both] [--topic backend|frontend|infra|ai]');
  console.error('The slug is the URL: lowercase letters, digits and hyphens, e.g. "hikari-pool-exhaustion".');
  process.exit(1);
}

const langOpt = flag('lang', 'ko');
const langs = langOpt === 'both' ? ['ko', 'en'] : [langOpt];
if (!langs.every((l) => l === 'ko' || l === 'en')) {
  console.error(`--lang must be ko, en or both (got "${langOpt}").`);
  process.exit(1);
}
const topic = flag('topic', 'backend');
if (!TOPICS.includes(topic)) {
  console.error(`--topic must be one of ${TOPICS.join(', ')} (got "${topic}").`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const dir = path.join('src', 'content', 'posts', slug);
fs.mkdirSync(dir, { recursive: true });

const template = {
  ko: `---
title: 제목
description: 검색 결과와 목록에 보일 한두 문장 요약
date: ${today}
topics: [${topic}]
tags: []
draft: true
---

첫 문단에서 이 글이 답하는 질문과 결론을 먼저 말합니다.

## 첫 번째 소제목
`,
  en: `---
title: Title
description: One or two sentences shown in search results and lists
date: ${today}
topics: [${topic}]
tags: []
draft: true
---

State the question this post answers, and the answer, in the first paragraph.

## First section
`,
};

for (const lang of langs) {
  const file = path.join(dir, `${lang}.md`);
  if (fs.existsSync(file)) {
    console.error(`Skipped ${file}: it already exists.`);
    continue;
  }
  fs.writeFileSync(file, template[lang]);
  console.log(`Created ${file}`);
}
console.log('Preview with "npm run dev", then set draft: false when it is ready to publish.');
