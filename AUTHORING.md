# 글쓰기 가이드

글 하나 = 폴더 하나, 언어 하나 = 파일 하나. 나머지(목록, 주제·태그 페이지, 타임라인, RSS, sitemap, 검색 색인, 언어 연결, 구조화 데이터, `llms.txt`)는 빌드가 만듭니다.

```
src/content/posts/<slug>/
  ko.md          한국어 (선택)
  en.md          영어 (선택) — 같은 폴더에 있으면 번역으로 자동 연결
  cover.png      이미지는 같은 폴더에
```

## 새 글 쓰기

1. 만들기

   ```bash
   npm run new-post -- hikari-pool-exhaustion --lang ko --topic backend
   # --lang: ko | en | both, --topic: backend | frontend | infra | ai
   ```

2. `npm run dev`로 띄우고 `http://localhost:4321/`에서 확인합니다. dev에서는 `draft: true` 글도 보입니다.
3. 다 쓰면 `draft: false`로 바꾸고 커밋 → `main`에 push. 몇 분 뒤 배포됩니다.

## frontmatter

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `title` | ✓ | 제목 |
| `description` | ✓ | 목록·검색·공유 미리보기에 보이는 1–2문장 (240자 이하) |
| `date` | ✓ | 작성일 `YYYY-MM-DD` |
| `updated` |  | 수정일 `YYYY-MM-DD`. 글 머리에 "수정"으로 표시 |
| `topics` | ✓ | `backend`, `frontend`, `infra`, `ai` 중 하나 이상 |
| `tags` |  | 자유 태그. 공백은 `-`로 바뀌어 주소가 됩니다 (`장애 분석` → `/tags/장애-분석/`) |
| `thumbnail` |  | 같은 폴더의 이미지 경로 (`./cover.png`). 목록과 글 머리에 16:9로 표시 |
| `thumbnailAlt` |  | 썸네일 설명 |
| `draft` |  | `true`면 배포되지 않음 |

필드가 틀리면 `npm run check`와 빌드가 어느 파일의 어느 필드인지 알려 주며 실패합니다.

## 본문 요소

- 제목은 `##`부터. `##`/`###`가 3개 이상이면 오른쪽(모바일은 하단 버튼) 목차가 생깁니다.
- 각주: `본문[^key]` … `[^key]: 내용`
- 이미지: `![설명](./diagram.png)` — 같은 폴더에 두면 빌드가 최적화합니다.
- 코드 블록:

  ````md
  ```ts title="src/app.ts" {2-3}
  const a = 1;
  const b = 2; // 2–3행 강조
  const c = 3;
  ```
  ````

  - `title="..."` 파일명 표시, `{2-3}` 줄 강조, `nolines` 줄번호 끄기
  - 줄 끝 주석: `// [!code ++]` 추가, `// [!code --]` 삭제, `// [!code highlight]` 강조
  - 복사 버튼은 자동으로 붙고, 삭제(`--`) 줄은 복사에서 빠집니다.
- 인터랙티브 데모가 필요하면 파일 확장자를 `.mdx`로 바꿔 컴포넌트를 쓸 수 있습니다.

## 번역

같은 `<slug>` 폴더에 다른 언어 파일을 추가하면 끝입니다. 두 글의 언어 전환 링크와 검색엔진용 `hreflang`이 자동으로 연결됩니다. 한쪽 언어만 있어도 됩니다.

## 타임라인

글은 자동으로 들어갑니다. 글이 아닌 일(이직, 프로젝트, 발표 등)은 따로 씁니다.

```md
<!-- src/content/timeline/2026-new-role/ko.md -->
---
title: 새 팀 합류
date: 2026-03-02
kind: career        # career | project | talk | writing | site | note
link: https://...   # 선택
---
한두 문장 설명 (선택)
```

## About · Resume

- About: `src/content/pages/about.ko.md`, `about.en.md`
- Resume: `src/content/resume/ko.yaml`, `en.yaml` — **비어 있는 섹션은 페이지에 나오지 않습니다.** 사실만 적어 주세요.

```yaml
profile:
  name: NeedPainkiller
  role: Backend Engineer            # 선택
  summary: 한 줄 소개                 # 선택
  links:
    - { label: github.com/NeedPainkiller, url: https://github.com/NeedPainkiller }
experience:
  - period: { start: "2024.03", end: "2026.02" }   # end를 비우면 "현재"
    company: 회사
    role: 직무
    url: https://...                               # 선택
    summary: 한 줄 요약                              # 선택
    highlights: [성과 1, 성과 2]                     # 선택
    stack: [Kotlin, Spring, PostgreSQL]             # 선택
projects:     [{ name, description, url?, period?, stack? }]
openSource:   [{ name, url, description? }]
talks:        [{ date: "2025.11", title, event, url? }]
publications: [{ year: "2025", title, url?, note? }]
skills:       [{ category: Backend, items: [Kotlin, Spring] }]
education:    [{ period: { start, end? }, school, detail? }]
```

Resume 페이지의 "인쇄 · PDF로 저장"은 브라우저 인쇄용으로 다듬어져 있습니다.

## 처음 한 번만: 배포와 댓글

1. **GitHub Pages**: 저장소 Settings → Pages → Source를 **GitHub Actions**로.
2. **giscus 댓글** (선택): 저장소를 공개로 두고 Settings → Features에서 **Discussions**를 켠 뒤 [giscus 앱](https://github.com/apps/giscus)을 설치합니다. [giscus.app](https://giscus.app)에서 받은 `repoId`, `categoryId`를 `src/site.config.ts`의 `giscus`에 넣으면 댓글이 나타납니다. 비워 두면 댓글 영역은 숨겨집니다.
3. **커스텀 도메인** (나중에): `src/site.config.ts`의 `origin`을 도메인으로 바꾸고 `public/CNAME`을 추가합니다. 사이트는 이미 루트(`base: '/'`)에 있습니다.

## 아직 채울 것

- 로고·아바타: 준비되면 `public/favicon.svg`(지금은 임시 "N" 모노그램)를 교체합니다.
- About 문구는 PRODUCT.md에 확정된 사실로만 쓴 초안입니다. 원하는 말투로 고쳐 주세요.
- Resume 데이터.
- `src/content/posts/`의 `kitchen-sink`, `fixture-short-note`, `fixture-en-only`는 화면 검증용 draft 픽스처입니다. 배포되지 않으며, 브라우저 테스트가 사용합니다.
