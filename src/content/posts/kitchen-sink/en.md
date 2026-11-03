---
title: '[Fixture] When the HikariCP pool runs dry'
description: Every 30 minutes after a deploy, the API froze for five seconds. Narrowing pool exhaustion down with thread dumps, then fixing transaction boundaries and pool settings. (Development fixture, not a real post.)
date: 2026-11-03
topics: [backend, infra]
tags: [hikaricp, jpa, incident]
draft: true
---

> This is a **layout fixture**. It is marked `draft: true`, so it never ships to the live site.

Every 30 minutes after a deploy, API responses stalled for five seconds. The logs held a single line: `Connection is not available, request timed out after 30000ms`. This post walks through narrowing the pool exhaustion down with thread dumps, and the settings changed to keep it from coming back.

## Symptom: a five-second stall every 30 minutes

The database was the first suspect, but the slow-query log was empty. Instead, the pool's `pending` metric jumped from 0 to 20 exactly when the stalls happened.

## Narrowing it down with thread dumps

```bash title="dump.sh"
for i in 1 2 3; do
  jstack -l "$(pgrep -f app.jar)" > "dump-$i.txt"
  sleep 2
done
```

## Fixing the transaction boundary

```java title="ReportScheduler.java" {4}
@Scheduled(cron = "0 */30 * * * *")
public void syncReports() {
    List<Report> reports = reportService.loadPendingReadOnly();
    reports.forEach(r -> externalClient.push(r));
}
```

## Prevention checklist

1. Never do external I/O inside a transaction.
2. Keep `leak-detection-threshold` on in production.
3. Alert on the pool's `pending` metric.
