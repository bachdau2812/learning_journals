import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('creates a journal, finds it in the list, edits it, and reloads the deep link', async ({ page }) => {
  await page.getByRole('link', { name: 'Journals' }).click();
  await page.getByRole('button', { name: /new journal/i }).click();
  await page.getByLabel('Header').fill('Network journal draft');
  await page.getByLabel('Key takeaways').fill('TCP retransmits lost data.');
  await expect(page.getByText(/Saved/)).toBeVisible();

  await page.getByRole('button', { name: /back to journals/i }).click();
  await page.getByLabel('Search journals').fill('network journal');
  const row = page.locator('.journal-list__item').filter({ hasText: 'Network journal draft' });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Edit' }).click();

  await expect(page.getByLabel('Header')).toHaveValue('Network journal draft');
  await page.getByLabel('Key takeaways').fill('TCP retransmits lost data after timeout.');
  await expect(page.getByText(/Saved/)).toBeVisible();
  const journalUrl = page.url();
  await page.goto(journalUrl);
  await expect(page.getByLabel('Key takeaways')).toHaveValue('TCP retransmits lost data after timeout.');
});

test('exports a journal backup, clears local storage, and restores with Replace', async ({ page }, testInfo) => {
  await page.goto('/journals/new?domain=cs&journalType=cs-lab');
  await page.getByLabel('Header').fill('Linux process lab');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.getByRole('textbox', { name: 'Question 1', exact: true }).fill('How do I inspect running processes?');
  await page.getByRole('textbox', { name: 'Answer 1', exact: true }).fill('Use ps and top.');
  await expect(page.getByText(/Saved/)).toBeVisible();
  const journalUrl = page.url();

  await page.goto('/settings');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export json backup/i }).click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  const backup = await readFile(backupPath);

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByLabel('Choose JSON backup').setInputFiles({
    name: 'learning-journal-backup.json',
    mimeType: 'application/json',
    buffer: backup,
  });
  await expect(page.getByText(/Backup ready: 1 journals/i)).toBeVisible();
  await page.getByRole('button', { name: /replace local data/i }).click();
  await expect(page.getByText('Local data replaced from backup.')).toBeVisible();
  await page.getByRole('link', { name: 'Journals' }).click();
  await expect(page.getByRole('heading', { name: 'Linux process lab' })).toBeVisible();
  await page.goto(journalUrl);
  await expect(page.getByRole('textbox', { name: 'Question 1', exact: true })).toHaveValue('How do I inspect running processes?');
  await expect(page.getByRole('textbox', { name: 'Answer 1', exact: true })).toHaveValue('Use ps and top.');
  testInfo.attach('restored-backup.json', { path: backupPath, contentType: 'application/json' });
});

test('opens and refreshes topic and journal deep links', async ({ page }) => {
  await page.goto('/topics/lld-oop-fundamentals');
  await expect(page.getByRole('main', { name: 'OOP Fundamentals journals' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('main', { name: 'OOP Fundamentals journals' })).toBeVisible();

  await expect(page.getByRole('link', { name: /encapsulation/i })).toHaveCount(0);
  await page.getByRole('button', { name: /new journal/i }).click();
  await page.getByLabel('Header').fill('OOP concepts');
  await expect(page.getByText(/Saved/)).toBeVisible();
  await page.waitForTimeout(900);
  await page.reload();
  await expect(page.getByLabel('Header')).toHaveValue('OOP concepts');
});

test('authors questions, removes one, changes metadata, reloads and duplicates without losing answers', async ({ page }) => {
  await page.goto('/journals/new?domain=cs&topicId=cs-networking-tcp-udp&journalType=cs-knowledge');
  await page.getByLabel('Header').fill('My network questions');
  await expect(page.getByRole('textbox', { name: /^Question \d+$/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.getByRole('textbox', { name: 'Question 1', exact: true }).fill('What is TCP?');
  await page.getByRole('textbox', { name: 'Answer 1', exact: true }).fill('A reliable byte stream.');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.getByRole('textbox', { name: 'Question 2', exact: true }).fill('Why use UDP?');
  await page.getByRole('textbox', { name: 'Answer 2', exact: true }).fill('For independent datagrams.');
  await page.getByLabel('Status for question 2').selectOption('done');
  await page.getByRole('button', { name: 'Remove question 1' }).click();
  await page.getByRole('combobox', { name: 'Domain', exact: true }).selectOption('system-design');
  await page.getByRole('combobox', { name: 'System Design layer', exact: true }).selectOption('hld');
  await page.getByRole('combobox', { name: 'Journal type', exact: true }).selectOption('system-design-hld-practice');
  await expect(page.getByText(/^Saved$/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('textbox', { name: /^Question \d+$/ })).toHaveCount(1);
  await expect(page.getByRole('textbox', { name: 'Question 1', exact: true })).toHaveValue('Why use UDP?');
  await expect(page.getByRole('textbox', { name: 'Answer 1', exact: true })).toHaveValue('For independent datagrams.');
  await expect(page.getByLabel('Status for question 1')).toHaveValue('done');
  await page.goto('/journals');
  await page.locator('.journal-list__item').filter({ hasText: 'My network questions' }).getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByLabel('Header')).toHaveValue('My network questions (copy)');
  await expect(page.getByRole('textbox', { name: 'Answer 1', exact: true })).toHaveValue('For independent datagrams.');
  await page.getByRole('button', { name: 'Remove question 1' }).click();
  await expect(page.getByText(/^Saved$/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('textbox', { name: /^Question \d+$/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add question' })).toBeVisible();
});

test('opens major topics directly and redirects retired subtopic URLs', async ({ page }) => {
  const topics = [
    ['system-design-lld', 'OOP Fundamentals', 'lld-oop-fundamentals'],
    ['system-design-hld', 'Requirements & Capacity Estimation', 'hld-requirements-capacity'],
    ['system-design-distributed', 'Consistency & Replication', 'distributed-consistency-replication'],
    ['cs-networking', 'TCP & UDP', 'cs-networking-tcp-udp'],
  ];
  for (const [groupId, , topicId] of topics) {
    await page.goto(`/browse/${groupId}`);
    const link = page.locator(`a[href="/topics/${topicId}"]`);
    await expect(link).toBeVisible();
    await link.click();
    await expect(page.getByRole('button', { name: 'New journal', exact: true })).toBeVisible();
    await expect(page.locator('.navigation-card')).toHaveCount(0);
  }
  await page.goto('/topics/lld-oop-fundamentals--encapsulation-invariants');
  await expect(page).toHaveURL(/\/topics\/lld-oop-fundamentals$/);
  await page.goto('/browse/cs-networking-tcp-udp--handshake-reliability');
  await expect(page).toHaveURL(/\/topics\/cs-networking-tcp-udp$/);
});

test('question editor fits mobile and desktop widths', async ({ page }, testInfo) => {
  await page.goto('/journals/new?domain=cs');
  await page.getByRole('button', { name: 'Add question' }).click();
  await page.getByRole('textbox', { name: 'Question 1', exact: true }).fill('How do distributed systems preserve ordering across concurrent writes?');
  await page.getByRole('textbox', { name: 'Answer 1', exact: true }).fill('Explore ordering guarantees, failure cases and trade-offs.');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('.editor-answers').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const path = testInfo.outputPath(`questions-${width}.png`);
    await page.screenshot({ path });
    await testInfo.attach(`questions-${width}`, { path, contentType: 'image/png' });
  }
});

test('uses responsive one and two column layouts without horizontal overflow', async ({ page }) => {
  const widths = [360, 390, 640, 768, 1024, 1440, 1920];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      columns: getComputedStyle(document.querySelector('.area-grid')).gridTemplateColumns,
      homeWidth: document.querySelector('.home-page').getBoundingClientRect().width,
      gridWidth: document.querySelector('.area-grid').getBoundingClientRect().width,
    }));
    expect(metrics.scrollWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(metrics.clientWidth);
    expect(metrics.gridWidth, `home cards should fill the centered page width at ${width}px`).toBeGreaterThanOrEqual(metrics.homeWidth - 1);
    if (width <= 639) expect(metrics.columns.split(' ').length).toBe(1);
    else if (width <= 1023) expect(metrics.columns.split(' ').length).toBe(2);
    else expect(metrics.columns.split(' ').length).toBe(3);
  }
});

test('keeps navigation text flat and reduces motion when requested', async ({ page }) => {
  const card = page.locator('.area-card').first();
  const initialPlane = await card.evaluate((element) => getComputedStyle(element.querySelector('.spatial-card__plane')).transform);
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element.querySelector('.spatial-card__plane')).transform)).not.toBe(initialPlane);
  expect(await card.evaluate((element) => getComputedStyle(element.querySelector('.area-card__title')).transform)).toBe('none');

  await card.click();
  await expect(page).toHaveURL(/\/browse\/dsa$/);
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element.querySelector('.spatial-card__plane')).transitionDuration)).toBe('0s');
});

async function recordSpatialEvents(page) {
  await page.evaluate(() => {
    window.spatialEvents = [];
    for (const type of ['spatialtransitionprepare', 'spatialtransitionstart', 'spatialtransitionfinish', 'spatialtransitioncancel']) {
      document.addEventListener(type, (event) => {
        window.spatialEvents.push({ type, detail: event.detail });
      });
    }
  });
}

async function waitForSpatialFinish(page, count) {
  await expect.poll(() => page.evaluate(() => window.spatialEvents.filter((event) => event.type === 'spatialtransitionfinish').length)).toBe(count);
}

test('browser Back and Forward preserve spatial direction', async ({ page }) => {
  await recordSpatialEvents(page);
  await page.locator('.area-card').first().click();
  await expect(page).toHaveURL(/\/browse\/dsa$/);
  await waitForSpatialFinish(page, 1);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await waitForSpatialFinish(page, 2);
  await page.goForward();
  await expect(page).toHaveURL(/\/browse\/dsa$/);
  await waitForSpatialFinish(page, 3);
  expect(await page.evaluate(() => window.spatialEvents.filter((event) => event.type === 'spatialtransitionstart').map((event) => event.detail.direction))).toEqual(['forward', 'back', 'forward']);
});

test('new page stays readable after the spatial shell handoff', async ({ page }) => {
  await recordSpatialEvents(page);
  await page.locator('.area-card').first().click();
  await waitForSpatialFinish(page, 1);
  const state = await page.evaluate(() => {
    const stage = document.querySelector('.route-stage');
    const style = getComputedStyle(stage);
    return {
      opacity: style.opacity,
      transform: style.transform,
      shellCount: document.querySelectorAll('[data-spatial-shell]').length,
      stageAnimation: style.animationName,
    };
  });
  expect(state).toEqual({ opacity: '1', transform: 'none', shellCount: 0, stageAnimation: 'none' });
});

test('the shared shell stays separate from text and returns to the exact card', async ({ page }) => {
  await recordSpatialEvents(page);
  const card = page.locator('.area-card').first();
  const original = await card.boundingBox();
  await card.click();
  await expect.poll(() => page.evaluate(() => document.querySelectorAll('[data-spatial-shell]').length)).toBe(1);
  const during = await page.evaluate(() => ({
    shellCount: document.querySelectorAll('[data-spatial-shell]').length,
    shellViewTransition: getComputedStyle(document.querySelector('[data-spatial-shell]')).viewTransitionName,
    textTransforms: [...document.querySelectorAll('.spatial-card :is(.area-card__title, .navigation-card__title)')].map((element) => getComputedStyle(element).transform),
    namedElements: [...document.querySelectorAll('[style*="view-transition-name"]:not([data-spatial-shell]), [data-spatial-shared]')].length,
  }));
  expect(during.shellCount).toBe(1);
  expect(during.shellViewTransition).toBe('none');
  expect(during.textTransforms.every((transform) => transform === 'none')).toBeTruthy();
  expect(during.namedElements).toBe(0);
  await waitForSpatialFinish(page, 1);
  await page.getByRole('link', { name: 'Back' }).click();
  await waitForSpatialFinish(page, 2);
  const reverse = await page.evaluate(() => {
    const event = window.spatialEvents.filter((item) => item.type === 'spatialtransitionstart' && item.detail.direction === 'back').at(-1);
    const target = document.querySelector('.area-card[data-spatial-id="browse/dsa"]');
    const rect = target.getBoundingClientRect();
    return { event: event.detail.to, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };
  });
  expect(Math.abs(reverse.event.left - reverse.rect.left)).toBeLessThan(1);
  expect(Math.abs(reverse.event.top - reverse.rect.top)).toBeLessThan(1);
  expect(Math.abs(reverse.event.width - reverse.rect.width)).toBeLessThan(1);
  expect(Math.abs(reverse.event.height - reverse.rect.height)).toBeLessThan(1);
  expect(Math.abs(reverse.event.left - original.x)).toBeLessThan(1);
});

test('deep navigation reverses through the immediately previous card at every level', async ({ page }) => {
  await recordSpatialEvents(page);
  let completedTransitions = 0;
  const clickAndWait = async (locator) => {
    await locator.click();
    completedTransitions += 1;
    await waitForSpatialFinish(page, completedTransitions);
  };
  await clickAndWait(page.locator('.area-card').first());
  await clickAndWait(page.getByRole('link', { name: /Arrays & Strings/i }));
  await clickAndWait(page.getByRole('link', { name: 'Array & Hashing' }));
  await clickAndWait(page.getByRole('link', { name: 'Two Sum' }));
  await expect(page).toHaveURL(/\/topics\/dsa-problem-1$/);
  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('link', { name: 'Back' }).click();
    completedTransitions += 1;
    await waitForSpatialFinish(page, completedTransitions);
  }
  await expect(page).toHaveURL(/\/$/);
  const backEvents = await page.evaluate(() => window.spatialEvents.filter((event) => event.type === 'spatialtransitionstart' && event.detail.direction === 'back').map((event) => event.detail.focusId));
  expect(backEvents).toEqual(['dsa-problem-1', 'array-hashing', 'dsa-arrays-strings', 'browse/dsa']);
});

test('destination cards are ready when the spatial shell starts', async ({ page }) => {
  await page.evaluate(() => {
    window.cardOpacityAtTransitionStart = null;
    document.addEventListener('spatialtransitionstart', () => {
      window.cardOpacityAtTransitionStart = [...document.querySelectorAll('.navigation-card.spatial-card')].map((card) => getComputedStyle(card).opacity);
    });
  });
  await page.locator('.area-card').first().click();
  await expect.poll(() => page.evaluate(() => window.cardOpacityAtTransitionStart)).not.toBeNull();
  expect(await page.evaluate(() => window.cardOpacityAtTransitionStart)).toEqual(Array(7).fill('1'));
});

test('rapid repeated clicks keep one spatial shell and one history entry', async ({ page }) => {
  await recordSpatialEvents(page);
  await page.locator('.area-card').first().dblclick({ delay: 20 });
  await expect(page).toHaveURL(/\/browse\/dsa$/);
  await waitForSpatialFinish(page, 1);
  const result = await page.evaluate(() => ({
    historyEntries: history.length,
    shells: document.querySelectorAll('[data-spatial-shell]').length,
    starts: window.spatialEvents.filter((event) => event.type === 'spatialtransitionstart').length,
  }));
  expect(result.shells).toBe(0);
  expect(result.starts).toBe(1);
});

test('reduced motion completes the same spatial route without a visible flight', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await recordSpatialEvents(page);
  await page.locator('.area-card').first().click();
  await expect(page).toHaveURL(/\/browse\/dsa$/);
  await waitForSpatialFinish(page, 1);
  const result = await page.evaluate(() => ({
    duration: window.spatialEvents.find((event) => event.type === 'spatialtransitionstart')?.detail.duration,
    shellCount: document.querySelectorAll('[data-spatial-shell]').length,
  }));
  expect(result).toEqual({ duration: 1, shellCount: 0 });
});

test('off-center mobile cards resolve their real reverse geometry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await recordSpatialEvents(page);
  const card = page.locator('.area-card').nth(2);
  const source = await card.boundingBox();
  await card.click();
  await waitForSpatialFinish(page, 1);
  await page.getByRole('link', { name: 'Back' }).click();
  await waitForSpatialFinish(page, 2);
  const result = await page.evaluate(() => {
    const event = window.spatialEvents.filter((item) => item.type === 'spatialtransitionstart' && item.detail.direction === 'back').at(-1);
    const rect = document.querySelector('.area-card[data-spatial-id="browse/cs-fundamentals"]').getBoundingClientRect();
    return { event: event.detail.to, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  expect(Math.abs(result.event.left - result.rect.left)).toBeLessThan(1);
  expect(Math.abs(result.event.top - result.rect.top)).toBeLessThan(1);
  expect(result.overflow).toBeLessThanOrEqual(0);
  expect(Math.abs(result.event.left - source.x)).toBeLessThan(1);
});

test('direct deep links use a safe fallback before reversing to a known parent card', async ({ page }) => {
  await page.goto('/topics/dsa-problem-1');
  await recordSpatialEvents(page);
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(page).toHaveURL(/\/browse\/array-hashing$/);
  await waitForSpatialFinish(page, 1);
  const result = await page.evaluate(() => ({
    focusId: window.spatialEvents.find((event) => event.type === 'spatialtransitionstart')?.detail.focusId,
    shells: document.querySelectorAll('[data-spatial-shell]').length,
  }));
  expect(result).toEqual({ focusId: 'dsa-problem-1', shells: 0 });
});
