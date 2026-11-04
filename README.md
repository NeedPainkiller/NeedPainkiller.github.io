# NeedPainkiller.github.io

NeedPainkiller의 한/영 개발 블로그. Astro로 만든 정적 사이트이며, 글은 이 저장소의 Markdown 파일로 git에서 버전 관리합니다. DB는 없습니다.

- 사이트: https://needpainkiller.github.io/
- 글쓰기 방법: [AUTHORING.md](AUTHORING.md)

## 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 로컬 미리보기 (`http://localhost:4321/`, draft 글 포함) |
| `npm run new-post -- <slug>` | 새 글 폴더와 frontmatter 생성 |
| `npm run check` | 타입·콘텐츠 스키마 검사 |
| `npm test` | 단위 테스트 |
| `npm run build` | 배포용 빌드 (`dist/`) + 검색 색인 |
| `npm run test:e2e` | 빌드 결과에 대한 브라우저 테스트 (아래 참고) |

브라우저 테스트는 draft 픽스처를 포함한 빌드가 필요합니다.

```bash
SHOW_DRAFTS=1 npm run build
PW_CHANNEL=msedge npm run test:e2e   # 설치된 Edge/Chrome 사용. 없으면 npx playwright install chromium
```

`main`에 push하면 GitHub Actions가 검사·테스트·빌드 후 GitHub Pages에 배포합니다.
