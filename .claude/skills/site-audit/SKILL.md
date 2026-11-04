---
name: site-audit
description: NeedPainkiller 블로그(needpainkiller.github.io)의 Lighthouse·SEO·GEO 점검. 배포가 끝난 뒤, head·레이아웃·구조화 데이터·sitemap·robots·llms.txt를 바꾼 뒤, 새 글을 발행한 뒤, 또는 사용자가 "측정", "점검", "Lighthouse", "SEO", "GEO", "검색 노출", "성능 점수"를 말할 때 사용한다. npm run audit / audit:local 실행, 보고서 판독, 원인별 수정 위치, 수동 점검 체크리스트를 담는다.
---

# Site audit

측정은 항상 스크립트로 한다. 손으로 curl을 조합하거나 Lighthouse를 따로 돌려 숫자를 비교하지 않는다. 스크립트가 매번 같은 페이지·같은 버전·같은 기준으로 재고, 지난 측정과의 차이를 계산한다.

- 스크립트: `scripts/site-audit.mjs` (의존성 없음, Lighthouse는 고정 버전을 npx로 실행)
- 결과: `reports/audit-<UTC 시각>/report.md`, `report.json`, 페이지별 Lighthouse JSON
- 추이: `reports/history.jsonl` (실행마다 한 줄). `reports/`는 gitignore 대상이라 이 기기에만 남는다.

## 1. 무엇을 잴지 정한다

| 상황 | 명령 | 이유 |
|---|---|---|
| 배포 직후, 정기 점검 | `npm run audit` | 실제 사이트. 성능 점수는 이것만 믿는다. |
| 커밋 전 회귀 확인 | `npm run build` 후 `npm run audit:local` | dist를 직접 띄워 잰다. SEO·접근성·구조 점검용. |
| 글 페이지까지 로컬에서 | `SHOW_DRAFTS=1 npm run build` 후 `npm run audit:local` | draft 픽스처가 sitemap에 들어가 글 페이지 점검이 돈다. 끝나면 `npm run build`로 dist를 되돌린다. |
| 빠르게 head만 | `npm run audit -- --no-lighthouse` | 몇 초. 메타·canonical·hreflang·JSON-LD·sitemap만. |
| 특정 페이지 | `npm run audit -- --pages /,/posts/<slug>/ --preset mobile` | 쉼표로 경로 나열. |

배포 직후에 잴 때는 먼저 배포가 끝났는지 확인한다. 끝나지 않은 배포를 재면 이전 버전을 잰다.

```bash
curl -s "https://api.github.com/repos/NeedPainkiller/NeedPainkiller.github.io/actions/runs?per_page=1" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s).workflow_runs[0];console.log(r.head_sha.slice(0,7),r.status,r.conclusion)})"
```

`completed success`이고 SHA가 방금 push한 커밋일 때만 잰다. 기다려야 하면 이 명령을 백그라운드 루프로 돌려 완료 알림을 받는다. 짧은 간격으로 반복 확인하지 않는다.

옵션: `--base <url>`, `--origin <url>`(기본 https://needpainkiller.github.io), `--serve`, `--pages`, `--preset mobile|desktop|both`, `--no-lighthouse`, `--min-score <n>`(기본 90), `--out <dir>`. 기본 페이지 집합은 `/`, `/en/`, `/about/`, `/en/about/`, `/resume/`와 sitemap의 한국어 글 2편, 영어 글 1편이다.

## 2. 무엇을 점검하나

| 영역 | 점검 | 수준 |
|---|---|---|
| robots.txt | 200, 프로덕션 sitemap을 가리키는 `Sitemap:` 줄, 전면 차단 여부, User-agent 목록 | error / warn / info |
| sitemap | index와 하위 sitemap 200, URL이 origin 안, **모든 URL이 200이고 noindex가 아님** | error |
| llms.txt / llms-full.txt | 200, `# `로 시작 | error |
| RSS | `/rss.xml`, `/en/rss.xml` 200, `<rss` 포함 | error |
| OG 기본 이미지, 404 | og-default.png가 이미지, 없는 경로가 404 | error |
| 페이지 head | `<html lang>` ko/en, title·description 존재, canonical = origin + 경로, h1 정확히 1개 | error |
| 길이 | title 표시폭 > 70, description 표시폭 50–320 밖 (한글은 2로 셈) | warn |
| hreflang | 자기 자신 항목, x-default, **상대 언어 페이지가 되돌아 링크** | error / warn |
| Open Graph | og:title·description·image·url, og:image 200 | error |
| JSON-LD | 파싱 가능, 글 페이지에 BlogPosting(headline·datePublished·dateModified·author·image), headline = h1 | error / warn |
| Lighthouse | 카테고리 점수 < `--min-score`, 90 미만 개별 audit 목록, LCP·CLS·TBT | error / 목록 |

Lighthouse 13부터 **Agentic Browsing** 카테고리가 있다. AI 에이전트가 페이지를 읽고 조작하기 쉬운지 보는 점수로, GEO 관점에서 SEO 점수와 함께 본다.

## 3. 결과를 읽는다

1. `report.md`의 Result 줄과 Findings 표의 **error**부터 본다. error가 있으면 스크립트 종료 코드가 1이다.
2. Lighthouse 표의 괄호 숫자는 이 사이트의 직전 측정 대비 변화다(같은 base, 점수가 있는 실행끼리 비교).
3. 판단 규칙:
   - **성능**은 실제 사이트 숫자로만 판단한다. 로컬 `astro preview`는 압축과 HTTP/2가 없어 한글 폰트를 쓰는 페이지의 모바일 LCP가 3초대로 나온다(실제 사이트에서는 1초대). 로컬 성능 점수로는 수정하지 않는다.
   - 성능 점수는 측정마다 ±5 흔들린다. 90 근처에서 떨어졌으면 한 번 더 재고, 두 번 다 낮을 때 원인을 찾는다.
   - 접근성·SEO·Best Practices·Agentic Browsing은 결정적이다. 한 번이라도 100 미만이면 원인 audit이 있다. `audits below 90` 목록에서 id를 확인한다.
   - warn은 고칠지 판단할 거리다. 특히 description 길이는 검색 결과 문구에 직결되니 대부분 고칠 가치가 있다.
4. 사용자에게 보고할 때: 측정 대상(base, 커밋), Lighthouse 표, error·warn 목록, 직전 대비 변화, 제안하는 수정을 적는다. 스크립트를 돌리지 않고 "문제없다"고 말하지 않는다.

## 4. 원인별 수정 위치

| 발견 | 고칠 곳 |
|---|---|
| description 짧음/긺 | 글: frontmatter `description`. 소개: `src/content/pages/about.*.md`. 그 외 페이지: `SITE.description` (`src/site.config.ts`) 또는 view에서 BaseLayout에 넘기는 `description` |
| title 김 | 글 frontmatter `title`. 접미사 " · NeedPainkiller"는 `BaseLayout.astro` |
| canonical 불일치 | `src/site.config.ts`의 `origin`/`base`, `BaseLayout.astro` |
| hreflang 되돌림 없음 | 번역 파일이 같은 `src/content/posts/<slug>/` 폴더에 있는지, 한쪽이 `draft: true`인지 확인. 목록 페이지는 각 view의 `alternates` |
| BlogPosting 누락·필드 누락 | `src/lib/structured-data.ts`, `src/views/PostView.astro` |
| sitemap URL 404 / noindex | 빌드 산출물과 `astro.config.ts`의 sitemap `filter`. noindex는 404에만 둔다 |
| llms.txt 형식 | `src/lib/llms.ts` |
| robots.txt | `src/pages/robots.txt.ts` (AI 크롤러 정책은 작성자 결정이 먼저) |
| button-name, link-name | 아이콘만 있는 컨트롤에 `aria-label` (`Header.astro`, `Footer.astro`) |
| color-contrast | `src/styles/tokens.css` 토큰. AA 4.5:1 이상 |
| LCP 높음(실제 사이트) | 글 썸네일 크기·`loading="eager"`(PostView), 폰트 로딩(`BaseLayout.astro`의 Pretendard 분할 CSS) |
| CLS | 크기 없는 이미지, 폰트 교체. 이미지는 `astro:assets`로 넣어 width/height를 갖게 한다 |

수정 후에는 `npm run check`, `npm test`, 필요하면 `SHOW_DRAFTS=1 npm run build && PW_CHANNEL=msedge npm run test:e2e`를 돌리고, `npm run audit:local`로 같은 항목이 사라졌는지 확인한 뒤 배포하고, 배포가 끝나면 `npm run audit`으로 실제 사이트를 다시 잰다.

## 5. 스크립트가 못 하는 점검 (월 1회 또는 큰 변경 후)

- **Google Search Console** (https://search.google.com/search-console): 색인 생성 범위, sitemap 제출 상태, 실제 사용자 Core Web Vitals, 수동 조치.
- **네이버 서치어드바이저** (https://searchadvisor.naver.com): 사이트 진단, 수집 현황, sitemap·RSS 제출. 한국어 독자 유입에 중요하다.
- **리치 결과 테스트** (https://search.google.com/test/rich-results): 글 URL로 BlogPosting·Breadcrumb가 인식되는지.
- **Schema Markup Validator** (https://validator.schema.org): JSON-LD 문법과 타입.
- **PageSpeed Insights** (https://pagespeed.web.dev): 트래픽이 쌓이면 CrUX 현장 데이터를 본다. 실험실 점수와 다를 수 있다.
- **AI 답변 엔진 노출(GEO)**: 대표 글 주제로 질문해 출처로 인용되는지 가끔 확인한다. 인용이 없다면 첫 문단이 질문과 답을 바로 말하는지, description이 구체적인지부터 본다.

이 결과를 확인했다면 보고할 때 출처와 날짜를 함께 적는다. 확인하지 않은 항목은 "확인하지 않음"으로 남긴다.

## 6. 환경 메모

- Lighthouse 버전은 스크립트 상단 `LIGHTHOUSE_VERSION`에 고정돼 있다. 올릴 때는 같은 날 이전 버전과 한 번 나란히 재서 점수 변화가 버전 탓인지 구분하고, 보고서에 버전이 기록되는지 확인한다.
- 브라우저는 `CHROME_PATH`가 있으면 그것을, 없으면 설치된 Chrome, 그다음 Edge를 쓴다. 이 기기에는 Chrome이 없고 Edge로 잰다.
- `audit:local`은 4323 포트를 쓰고 끝나면 서버를 내린다. 실패로 서버가 남으면 `netstat -ano | grep 4323`으로 확인하고 해당 PID를 종료한다.
