import { expect, test } from '@playwright/test';

/** These checks rely on the draft fixtures, so build with SHOW_DRAFTS=1 first. */
const POST = 'posts/kitchen-sink/';

test('home links to both languages and every main section', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://needpainkiller.github.io/en/',
  );
  for (const path of ['posts/', 'timeline/', 'about/', 'resume/']) {
    await expect(page.locator(`a[href="/${path}"]`).first()).toBeAttached();
  }
});

test('a post has contents, copyable code and localised footnotes', async ({ page, isMobile }) => {
  await page.goto(POST);
  await expect(page.locator('h1')).toContainText('HikariCP');
  await expect(page.locator('figure.code-frame').first().locator('.code-copy')).toBeVisible();
  await expect(page.locator('#footnote-label')).toHaveText('각주');
  const contents = isMobile ? page.locator('.toc-pill') : page.locator('.toc--rail');
  await expect(contents).toBeVisible();
  await expect(page.locator('[data-toc-link="footnote-label"]')).toHaveCount(0);
});

test('translated posts declare each other; single-language posts do not', async ({ page }) => {
  await page.goto(POST);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /\/en\/posts\/kitchen-sink\/$/);
  await page.goto('en/posts/fixture-en-only/');
  await expect(page.locator('link[hreflang="ko"]')).toHaveCount(0);
  await expect(page.locator('.post__langs a')).toHaveCount(0);
});

test('search finds Korean text from the keyboard shortcut', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is a desktop affordance');
  await page.goto(POST);
  await page.keyboard.press('Control+k');
  const dialog = page.locator('[data-search-dialog]');
  await expect(dialog).toBeVisible();
  await page.keyboard.type('트랜잭션');
  await expect(dialog.locator('.search__result').first()).toContainText('HikariCP');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('icon-only header controls keep an accessible name', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible();
  await expect(page.getByRole('button', { name: '다크 모드 전환' })).toBeVisible();
});

test('the theme choice survives a reload', async ({ page }) => {
  await page.goto('');
  const before = await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches);
  await page.locator('[data-theme-toggle]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', before ? 'light' : 'dark');
});

test('long code and tables never widen the page', async ({ page }) => {
  await page.goto(POST);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('the résumé shows sections with data and hides empty ones', async ({ page }) => {
  // QA builds render the labelled fixture, whose publications list is intentionally empty.
  await page.goto('resume/');
  await expect(page.locator('h1')).toHaveText('NeedPainkiller');
  await expect(page.locator('section.block')).toHaveCount(6);
  await expect(page.locator('#r-pub')).toHaveCount(0);
});

test('posts carry structured data and llms.txt lists them', async ({ page, request }) => {
  await page.goto(POST);
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  const nodes = data['@graph'] as Record<string, unknown>[];
  expect(nodes.map((n) => n['@type'])).toEqual(['BlogPosting', 'BreadcrumbList']);
  expect(nodes[0]!.headline).toBe((await page.locator('h1').textContent())?.trim());
  expect(nodes[0]!.workTranslation).toMatchObject({ url: 'https://needpainkiller.github.io/en/posts/kitchen-sink/' });

  const llms = await (await request.get('llms.txt')).text();
  expect(llms.startsWith('# NeedPainkiller')).toBe(true);
  expect(llms).toContain('https://needpainkiller.github.io/posts/kitchen-sink/');
  const full = await (await request.get('llms-full.txt')).text();
  expect(full).toContain('HikariCP');
});

test('every post ends with a next read, related or recent', async ({ page }) => {
  await page.goto(POST);
  await expect(page.locator('#related-title')).toHaveText('함께 읽기');
  await expect(page.locator('.related a[href*="fixture-related"]')).toBeAttached();
  await page.goto('posts/fixture-short-note/');
  await expect(page.locator('.related .post-row').first()).toBeAttached();
});
