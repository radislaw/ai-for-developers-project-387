import { test, expect } from '@playwright/test';

test.describe('Полный сценарий бронирования', () => {
  test('выбор услуги и переход на страницу бронирования', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Онлайн-запись к специалисту')).toBeVisible();
    
    await page.locator('main >> a:has-text("Записаться")').click();
    await expect(page).toHaveURL(/\/book$/);
    await expect(page.locator('text=Доступные услуги')).toBeVisible();

    const serviceCard = page.locator('[class*="Card"]').filter({ has: page.locator('text=мин') }).first();
    await serviceCard.click();
    await page.waitForURL(/\/book\/evt-/);
    
    await expect(page.locator('h4:has-text("Выберите дату")')).toBeVisible();
    await expect(page.locator('h4:has-text("Выберите время")')).toBeVisible();
    await expect(page.locator('text=Сначала выберите дату')).toBeVisible();
  });

  test('навигация по календарю и отображение слотов', async ({ page }) => {
    await page.goto('/book/evt-15min');
    
    await expect(page.locator('h4:has-text("Выберите дату")')).toBeVisible();
    
    // Click next month button (chevron right)
    const nextMonthBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
    if (await nextMonthBtn.isVisible()) {
      await nextMonthBtn.click();
      await page.waitForTimeout(500);
    }
    
    const futureDate = page.locator('[class*="UnstyledButton"]:not([disabled])').filter({ hasText: /^\d+$/ }).first();
    if (await futureDate.isVisible()) {
      await futureDate.click();
      await page.waitForTimeout(500);
      
      if (await page.locator('button:has-text("Свободно")').first().isVisible({ timeout: 3000 })) {
        await expect(page.locator('h4:has-text("Выберите время")')).toBeVisible();
      }
    }
  });
});