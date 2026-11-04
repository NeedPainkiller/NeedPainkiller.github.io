#!/usr/bin/env node
/**
 * Site audit: SEO/GEO checks + Lighthouse, with a report and a score history.
 *
 *   npm run audit                      live site, all checks, Lighthouse mobile + desktop
 *   npm run audit:local                serve dist/ with astro preview, audit it, stop the server
 *   npm run audit -- --no-lighthouse   head/endpoint checks only (fast)
 *
 * Options
 *   --base <url>        site to audit (default: --origin)
 *   --origin <url>      production origin used in canonical/hreflang/sitemap (default https://needpainkiller.github.io)
 *   --serve             start `astro preview` on port 4323 and audit it (implies --base http://127.0.0.1:4323)
 *   --pages <list>      comma-separated paths, e.g. /,/about/,/posts/my-post/ (default: core pages + newest posts in the sitemap)
 *   --preset <p>        mobile | desktop | both (default both)
 *   --no-lighthouse     skip Lighthouse
 *   --min-score <n>     Lighthouse category floor; below it is an error (default 90)
 *   --out <dir>         report directory (default reports/audit-<timestamp>)
 *
 * Exit code 1 when any error-level finding exists.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const LIGHTHOUSE_VERSION = '13.6.0';

// ---------- arguments ----------
const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) continue;
  const key = a.slice(2);
  if (key.startsWith('no-')) args[key.slice(3)] = false;
  else if (argv[i + 1] && !argv[i + 1].startsWith('--')) args[key] = argv[++i];
  else args[key] = true;
}
const trim = (u) => u.replace(/\/+$/, '');
const ORIGIN = trim(args.origin ?? 'https://needpainkiller.github.io');
const SERVE_PORT = 4323;
let BASE = trim(args.serve ? `http://127.0.0.1:${SERVE_PORT}` : (args.base ?? ORIGIN));
const PRESETS = args.preset === 'mobile' ? ['mobile'] : args.preset === 'desktop' ? ['desktop'] : ['mobile', 'desktop'];
const MIN_SCORE = Number(args['min-score'] ?? 90);
const RUN_LH = args.lighthouse !== false;
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
const OUT = args.out ?? path.join('reports', `audit-${stamp}`);

// ---------- findings ----------
const findings = [];
const add = (level, where, message) => findings.push({ level, where, message });

// ---------- helpers ----------
/** Windows runs npx through cmd; pass one quoted command string rather than args + shell (DEP0190). */
const quote = (s) => (/[\s"&|<>^]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s);
const isWin = process.platform === 'win32';
const execSync = (cmd, cmdArgs, opts = {}) =>
  isWin ? spawnSync([cmd, ...cmdArgs].map(quote).join(' '), { ...opts, shell: true }) : spawnSync(cmd, cmdArgs, opts);
const execAsync = (cmd, cmdArgs, opts = {}) =>
  isWin ? spawn([cmd, ...cmdArgs].map(quote).join(' '), { ...opts, shell: true }) : spawn(cmd, cmdArgs, opts);
const CATEGORY_LABEL = {
  performance: 'Perf',
  accessibility: 'A11y',
  'best-practices': 'Best',
  seo: 'SEO',
  'agentic-browsing': 'Agent',
};

const toLocal = (url) => (url.startsWith(ORIGIN) ? BASE + url.slice(ORIGIN.length) : url);
const decode = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
/** Rough display width: Hangul/CJK count double, which is closer to how search results truncate. */
const width = (s) => [...s].reduce((n, c) => n + (/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u3000-\u9FFF]/.test(c) ? 2 : 1), 0);

const cache = new Map();
async function get(url) {
  if (cache.has(url)) return cache.get(url);
  const p = (async () => {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const type = res.headers.get('content-type') ?? '';
      const text = /text|xml|json|javascript/.test(type) ? await res.text() : '';
      return { status: res.status, type, text };
    } catch (e) {
      return { status: 0, type: '', text: '', error: String(e.cause ?? e) };
    }
  })();
  cache.set(url, p);
  return p;
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

function parseHead(html) {
  const one = (re) => decode((re.exec(html) ?? [])[1] ?? '');
  const all = (re) => [...html.matchAll(re)];
  return {
    lang: one(/<html[^>]*\slang="([^"]*)"/),
    title: one(/<title>([^<]*)<\/title>/),
    description: one(/<meta name="description" content="([^"]*)"/),
    canonical: one(/<link rel="canonical" href="([^"]*)"/),
    robots: one(/<meta name="robots" content="([^"]*)"/),
    alternates: all(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/g).map((m) => ({ lang: m[1], href: m[2] })),
    og: Object.fromEntries(all(/<meta property="og:([a-z_:]+)" content="([^"]*)"/g).map((m) => [m[1], decode(m[2])])),
    h1: all(/<h1[\s>][\s\S]*?<\/h1>/g).map((m) => decode(m[0].replace(/<[^>]+>/g, '').trim())),
    jsonLd: all(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((m) => m[1]),
  };
}

function ldNodes(raw) {
  const data = JSON.parse(raw);
  return Array.isArray(data['@graph']) ? data['@graph'] : [data];
}

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const local = process.env.LOCALAPPDATA ?? '';
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          `${local}\\Google\\Chrome\\Application\\chrome.exe`,
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : process.platform === 'darwin'
        ? [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
          ]
        : [];
  return candidates.find((p) => fs.existsSync(p));
}

// ---------- local server ----------
let server;
async function startServer() {
  if (!fs.existsSync('dist/index.html')) throw new Error('dist/ is empty: run "npm run build" first.');
  server = execAsync('npx', ['astro', 'preview', '--port', String(SERVE_PORT), '--host', '127.0.0.1'], {
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    const r = await fetch(`${BASE}/`).catch(() => null);
    if (r?.ok) return;
    await new Promise((res) => setTimeout(res, 500));
  }
  throw new Error(`astro preview did not answer on ${BASE}`);
}
function stopServer() {
  if (!server) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill();
}

// ---------- checks ----------
async function checkEndpoints() {
  const rows = [];
  const expect = async (p, test, label) => {
    const r = await get(`${BASE}${p}`);
    const ok = test(r);
    rows.push({ path: p, status: r.status, type: r.type.split(';')[0], ok });
    if (!ok) add('error', p, `${label} (status ${r.status}${r.error ? `, ${r.error}` : ''})`);
    return r;
  };

  const robots = await expect('/robots.txt', (r) => r.status === 200, 'robots.txt missing');
  if (robots.status === 200) {
    if (!robots.text.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`))
      add('warn', '/robots.txt', 'no "Sitemap:" line pointing at the production sitemap');
    const agents = [...robots.text.matchAll(/^User-agent:\s*(.+)$/gim)].map((m) => m[1].trim());
    add('info', '/robots.txt', `user-agents: ${agents.join(', ') || '(none)'}`);
    if (/^Disallow:\s*\/\s*$/im.test(robots.text) && agents.includes('*'))
      add('warn', '/robots.txt', '"Disallow: /" present; check it is not blocking all crawlers');
  }

  const index = await expect('/sitemap-index.xml', (r) => r.status === 200 && r.text.includes('<sitemapindex'), 'sitemap index missing');
  const sitemapUrls = [];
  for (const loc of [...index.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
    const child = await get(toLocal(loc));
    if (child.status !== 200) add('error', loc, `child sitemap status ${child.status}`);
    sitemapUrls.push(...[...child.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  if (!sitemapUrls.length) add('error', '/sitemap-index.xml', 'sitemap lists no URLs');
  if (sitemapUrls.some((u) => !u.startsWith(ORIGIN))) add('error', 'sitemap', `URLs outside ${ORIGIN}`);

  await expect('/llms.txt', (r) => r.status === 200 && r.text.startsWith('# '), 'llms.txt missing or not starting with "# "');
  await expect('/llms-full.txt', (r) => r.status === 200, 'llms-full.txt missing');
  await expect('/rss.xml', (r) => r.status === 200 && r.text.includes('<rss'), 'Korean RSS missing');
  await expect('/en/rss.xml', (r) => r.status === 200 && r.text.includes('<rss'), 'English RSS missing');
  await expect('/og-default.png', (r) => r.status === 200 && r.type.startsWith('image/'), 'default OG image missing');
  await expect(`/__audit-missing-${Date.now()}/`, (r) => r.status === 404, 'unknown paths should return 404');

  // Every sitemap URL must answer 200 and must not be noindex.
  const swept = await pool(sitemapUrls, 6, async (u) => ({ u, r: await get(toLocal(u)) }));
  for (const { u, r } of swept) {
    if (r.status !== 200) add('error', u, `sitemap URL returns ${r.status}`);
    else if (/<meta name="robots" content="[^"]*noindex/.test(r.text)) add('error', u, 'in sitemap but marked noindex');
  }
  return { rows, sitemapUrls };
}

async function checkPage(p, sitemapUrls) {
  const url = `${BASE}${p}`;
  const prodUrl = `${ORIGIN}${p}`;
  const r = await get(url);
  if (r.status !== 200) {
    add('error', p, `status ${r.status}`);
    return { path: p, status: r.status };
  }
  const h = parseHead(r.text);
  const titleW = width(h.title);
  const descW = width(h.description);

  if (!['ko', 'en'].includes(h.lang)) add('error', p, `<html lang> is "${h.lang}"`);
  if (!h.title) add('error', p, 'missing <title>');
  else if (titleW > 70) add('warn', p, `title is long (width ${titleW} > 70): "${h.title}"`);
  if (!h.description) add('error', p, 'missing meta description');
  else if (descW < 50 || descW > 320) add('warn', p, `description width ${descW} outside 50–320`);
  if (h.h1.length !== 1) add(h.h1.length ? 'warn' : 'error', p, `${h.h1.length} <h1> elements`);
  if (h.canonical !== prodUrl) add('error', p, `canonical "${h.canonical}" should be "${prodUrl}"`);
  if (h.robots.includes('noindex')) add('warn', p, 'page is noindex');
  if (!sitemapUrls.includes(prodUrl) && !h.robots.includes('noindex')) add('warn', p, 'not listed in the sitemap');

  // hreflang: self entry, x-default, and every alternate links back.
  if (h.alternates.length) {
    if (!h.alternates.some((a) => a.lang === h.lang && a.href === prodUrl))
      add('error', p, `hreflang set lacks a self entry for "${h.lang}"`);
    if (!h.alternates.some((a) => a.lang === 'x-default')) add('warn', p, 'hreflang set has no x-default');
    for (const alt of h.alternates.filter((a) => a.lang !== h.lang && a.lang !== 'x-default')) {
      const other = await get(toLocal(alt.href));
      if (other.status !== 200) {
        add('error', p, `hreflang ${alt.lang} → ${alt.href} returns ${other.status}`);
        continue;
      }
      const back = parseHead(other.text).alternates;
      if (!back.some((a) => a.lang === h.lang && a.href === prodUrl))
        add('error', p, `hreflang ${alt.lang} page does not link back to this page`);
    }
  }

  // Open Graph
  for (const key of ['title', 'description', 'image', 'url']) if (!h.og[key]) add('error', p, `missing og:${key}`);
  if (h.og.image) {
    const img = await get(toLocal(h.og.image));
    if (img.status !== 200) add('error', p, `og:image returns ${img.status}`);
  }

  // JSON-LD
  const types = [];
  for (const raw of h.jsonLd) {
    try {
      for (const node of ldNodes(raw)) {
        types.push(node['@type']);
        if (node['@type'] === 'BlogPosting') {
          for (const f of ['headline', 'datePublished', 'dateModified', 'author', 'image'])
            if (!node[f]) add('error', p, `BlogPosting missing ${f}`);
          if (h.h1[0] && node.headline !== h.h1[0]) add('warn', p, 'BlogPosting headline differs from <h1>');
        }
      }
    } catch (e) {
      add('error', p, `JSON-LD does not parse: ${e.message}`);
    }
  }
  const isPost = /^\/(en\/)?posts\/[^/]+\/$/.test(p);
  if (isPost && !types.includes('BlogPosting')) add('error', p, 'post page has no BlogPosting JSON-LD');
  if (!h.jsonLd.length && !h.robots.includes('noindex')) add('info', p, 'no JSON-LD on this page');

  return { path: p, status: r.status, lang: h.lang, title: h.title, titleW, descW, h1: h.h1.length, hreflang: h.alternates.map((a) => a.lang).join(','), jsonLd: types.join(',') || '-' };
}

function runLighthouse(p, preset, dir) {
  const file = path.join(dir, `lh-${preset}-${p.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}.json`);
  const cmd = [
    '--yes',
    `lighthouse@${LIGHTHOUSE_VERSION}`,
    `${BASE}${p}`,
    '--quiet',
    '--output=json',
    `--output-path=${file}`,
    '--chrome-flags=--headless=new',
    ...(preset === 'desktop' ? ['--preset=desktop'] : []),
  ];
  const chrome = chromePath();
  const res = execSync('npx', cmd, {
    env: { ...process.env, ...(chrome ? { CHROME_PATH: chrome } : {}) },
    encoding: 'utf8',
  });
  if (!fs.existsSync(file)) {
    add('error', p, `Lighthouse (${preset}) failed: ${(res.stderr || res.stdout || '').split('\n').find((l) => /error/i.test(l)) ?? 'no output'}`);
    return null;
  }
  const lhr = JSON.parse(fs.readFileSync(file, 'utf8'));
  const scores = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]));
  const a = lhr.audits;
  const metrics = {
    LCP: a['largest-contentful-paint']?.displayValue,
    CLS: a['cumulative-layout-shift']?.displayValue,
    TBT: a['total-blocking-time']?.displayValue,
    FCP: a['first-contentful-paint']?.displayValue,
  };
  const failing = [];
  for (const [cat, c] of Object.entries(lhr.categories)) {
    if ((c.score ?? 0) * 100 < MIN_SCORE) add('error', p, `Lighthouse ${preset} ${cat} ${scores[cat]} < ${MIN_SCORE}`);
    for (const ref of c.auditRefs) {
      const audit = a[ref.id];
      if (ref.weight > 0 && audit && audit.score !== null && audit.score < 0.9) failing.push(`${cat}: ${audit.title} (${ref.id})`);
    }
  }
  return { path: p, preset, scores, metrics, failing: [...new Set(failing)], file };
}

// ---------- report ----------
function previousRun() {
  const file = path.join('reports', 'history.jsonl');
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  // Compare with the latest run on the same site that actually has Lighthouse scores.
  return lines.reverse().find((l) => l.base === BASE && Object.keys(l.scores ?? {}).length) ?? null;
}

function delta(prev, p, preset, cat, now) {
  const before = prev?.scores?.[p]?.[preset]?.[cat];
  if (before === undefined) return `${now}`;
  const d = now - before;
  return d === 0 ? `${now}` : `${now} (${d > 0 ? '+' : ''}${d})`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (args.serve) await startServer();
  console.log(`Auditing ${BASE} (origin ${ORIGIN})`);

  const { rows, sitemapUrls } = await checkEndpoints();
  const sitePaths = sitemapUrls.map((u) => u.slice(ORIGIN.length) || '/');
  const posts = sitePaths.filter((p) => /^\/(en\/)?posts\/[^/]+\/$/.test(p));
  const pages =
    typeof args.pages === 'string'
      ? args.pages.split(',').map((s) => s.trim()).filter(Boolean)
      : [...new Set(['/', '/en/', '/about/', '/en/about/', '/resume/', ...posts.filter((p) => !p.startsWith('/en/')).slice(0, 2), ...posts.filter((p) => p.startsWith('/en/')).slice(0, 1)])];

  const pageRows = [];
  for (const p of pages) pageRows.push(await checkPage(p, sitemapUrls));

  const lh = [];
  if (RUN_LH) {
    for (const p of pages) for (const preset of PRESETS) {
      process.stdout.write(`  lighthouse ${preset} ${p} … `);
      const r = runLighthouse(p, preset, OUT);
      console.log(r ? Object.values(r.scores).join('/') : 'failed');
      if (r) lh.push(r);
    }
  }
  stopServer();

  const prev = previousRun();
  const errors = findings.filter((f) => f.level === 'error');
  const warns = findings.filter((f) => f.level === 'warn');
  const scoresByPage = {};
  for (const r of lh) (scoresByPage[r.path] ??= {})[r.preset] = r.scores;

  // Category columns follow what this Lighthouse version reports (13.x adds Agentic Browsing).
  const cats = [...new Set(lh.flatMap((r) => Object.keys(r.scores)))];
  const label = (c) => CATEGORY_LABEL[c] ?? c;
  const md = [
    `# Site audit — ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    '',
    `- Base: ${BASE}  · Origin: ${ORIGIN}`,
    `- Lighthouse ${RUN_LH ? LIGHTHOUSE_VERSION : '(skipped)'}  · Browser: ${chromePath() ?? 'auto-detected by Lighthouse'}`,
    `- Result: **${errors.length} errors, ${warns.length} warnings**${prev ? `  · Compared with ${prev.date}` : ''}`,
    '',
    '## Lighthouse',
    '',
    lh.length
      ? [`| Page | Preset | ${cats.map(label).join(' | ')} | LCP | CLS | TBT |`, `|---|---|${cats.map(() => '---|').join('')}---|---|---|`,
         ...lh.map((r) => `| ${r.path} | ${r.preset} | ${cats.map((c) => delta(prev, r.path, r.preset, c, r.scores[c])).join(' | ')} | ${r.metrics.LCP} | ${r.metrics.CLS} | ${r.metrics.TBT} |`)].join('\n')
      : '_Skipped._',
    '',
    ...lh.filter((r) => r.failing.length).flatMap((r) => [`**${r.path} (${r.preset}) audits below 90:**`, ...r.failing.map((f) => `- ${f}`), '']),
    '## Findings',
    '',
    findings.length
      ? ['| Level | Where | Message |', '|---|---|---|', ...findings.sort((a, b) => ['error', 'warn', 'info'].indexOf(a.level) - ['error', 'warn', 'info'].indexOf(b.level)).map((f) => `| ${f.level} | ${f.where} | ${f.message.replace(/\|/g, '\\|')} |`)].join('\n')
      : '_None._',
    '',
    '## Pages',
    '',
    ['| Page | Status | Lang | Title width | Desc width | h1 | hreflang | JSON-LD |', '|---|---|---|---|---|---|---|---|',
     ...pageRows.map((r) => `| ${r.path} | ${r.status} | ${r.lang ?? ''} | ${r.titleW ?? ''} | ${r.descW ?? ''} | ${r.h1 ?? ''} | ${r.hreflang ?? ''} | ${r.jsonLd ?? ''} |`)].join('\n'),
    '',
    '## Endpoints',
    '',
    ['| Path | Status | Type | OK |', '|---|---|---|---|', ...rows.map((r) => `| ${r.path} | ${r.status} | ${r.type} | ${r.ok ? 'yes' : '**no**'} |`)].join('\n'),
    '',
    `Sitemap URLs checked: ${sitemapUrls.length}`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'report.md'), md);
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ base: BASE, origin: ORIGIN, findings, pages: pageRows, endpoints: rows, lighthouse: lh }, null, 2));
  fs.mkdirSync('reports', { recursive: true });
  fs.appendFileSync(
    path.join('reports', 'history.jsonl'),
    `${JSON.stringify({ date: new Date().toISOString(), base: BASE, lighthouse: RUN_LH ? LIGHTHOUSE_VERSION : null, errors: errors.length, warnings: warns.length, scores: scoresByPage })}\n`,
  );

  console.log(`\n${errors.length} errors, ${warns.length} warnings → ${path.join(OUT, 'report.md')}`);
  for (const f of [...errors, ...warns].slice(0, 20)) console.log(`  [${f.level}] ${f.where}: ${f.message}`);
  process.exitCode = errors.length ? 1 : 0;
}

main().catch((e) => {
  stopServer();
  console.error(e.message ?? e);
  process.exitCode = 1;
});
