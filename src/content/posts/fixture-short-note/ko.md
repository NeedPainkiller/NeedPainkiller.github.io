---
title: '[예시] :has()로 빈 상태 숨기기'
description: 자식이 없을 때 섹션 전체를 숨기는 짧은 메모. (개발용 예시 글, 실제 게시물 아님)
date: 2025-12-20
topics: [frontend]
tags: [css]
draft: true
---

목록이 비면 제목까지 숨기고 싶을 때 자바스크립트 없이 `:has()`로 해결할 수 있다.

```css
section:not(:has(li)) {
  display: none;
}
```

짧은 글에는 목차가 나타나지 않아야 한다.
