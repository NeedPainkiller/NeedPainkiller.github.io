---
title: '[예시] JPA N+1을 쿼리 로그로 먼저 잡기'
description: 느린 목록 화면의 원인이 N+1인지 쿼리 로그 한 번으로 확인하고, fetch join과 배치 크기로 고친 과정. (개발용 예시 글, 실제 게시물 아님)
date: 2026-09-14
topics: [backend]
tags: [jpa, hibernate, 성능]
thumbnail: ./cover.png
thumbnailAlt: orders 조회 한 번 뒤에 items 조회가 200번 반복되는 쿼리 로그
draft: true
---

목록 화면이 주문 수에 비례해 느려진다면 가장 먼저 쿼리 로그를 켠다. 같은 모양의 쿼리가 줄줄이 찍히면 N+1이다.

## 로그 켜기

```yaml title="application.yml"
spring:
  jpa:
    properties:
      hibernate:
        format_sql: true
logging:
  level:
    org.hibernate.SQL: debug
```

## 패턴 읽기

주문 한 건을 읽는 쿼리 뒤로 `items` 조회가 주문 수만큼 반복된다면, 컬렉션을 지연 로딩하면서 루프 안에서 접근하고 있다는 뜻이다.

## 고치기

```java title="OrderRepository.java"
@Query("select o from Order o join fetch o.items where o.member.id = :memberId")
List<Order> findWithItems(@Param("memberId") Long memberId);
```

페이지네이션이 필요하면 fetch join 대신 `default_batch_fetch_size`로 `IN` 쿼리를 묶는다.
