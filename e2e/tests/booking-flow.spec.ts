import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should navigate home to catalog', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page.locator('text=Онлайн-запись к специалисту')).toBeVisible();

    // Click main CTA
    await page.locator('main >> a:has-text("Записаться")').click();
    await expect(page).toHaveURL(/\/book$/);

    // Catalog should show
    await expect(page.locator('text=Доступные услуги')).toBeVisible();
  });

  test('should navigate to book page from catalog', async ({ page }) => {
    // Go to catalog
    await page.goto('/book');
    await expect(page.locator('text=Доступные услуги')).toBeVisible();

    // Click first service
    const firstService = page.locator('div').filter({ has: page.locator('text=мин') }).first();
    if (await firstService.isVisible()) {
      await firstService.click();
      // Should navigate to book/:id page
      await page.waitForURL(/\/book\/evt-/);
    }
  });

  test('should navigate using sidebar', async ({ page }) => {
    await page.goto('/');

    // Sidebar nav to catalog
    await page.locator('nav >> a:has-text("Записаться")').click();
    await expect(page).toHaveURL(/\/book$/);

    // Sidebar nav to admin
    await page.locator('nav >> a:has-text("Админка")').click();
    await expect(page).toHaveURL(/\/admin$/);

    // Back to catalog
    await page.locator('nav >> a:has-text("Записаться")').click();
    await expect(page).toHaveURL(/\/book$/);
  });

  test('should display booking form with date picker on /book/:id', async ({ page }) => {
    await page.goto('/book');

    // Wait for services to load
    await expect(page.locator('text=Доступные услуги')).toBeVisible();
    
    // Click first service card
    const firstService = page.locator('[class*="Card"]').filter({ has: page.locator('text=мин') }).first();
    
    // Wait for card to be visible and clickable
    await firstService.waitFor({ state: 'visible' });
    await firstService.click();
    
    // Wait for navigation to event page
    await page.waitForURL(/\/book\/evt-/, { timeout: 10000 });

    // Verify date picker, time slot list, and form sections are present
    await expect(page.locator('h4:has-text("Выберите дату")')).toBeVisible();
    await expect(page.locator('h4:has-text("Выберите время")')).toBeVisible();
  });
});
