import { test, expect } from '@playwright/test';

test.describe('Admin Page', () => {
  test('should render admin page with stats and bookings section', async ({ page }) => {
    await page.goto('/admin');

    // Verify page title
    await expect(page.locator('text=Панель администратора')).toBeVisible();

    // Verify stats cards
    await expect(page.locator('text=Предстоящих записей')).toBeVisible();
    await expect(page.locator('text=/^Услуг$/')).toBeVisible();
    await expect(page.locator('text=Активен')).toBeVisible();

    // Verify bookings section
    await expect(page.locator('text=Предстоящие бронирования')).toBeVisible();
  });

  test('should show created booking in admin table', async ({ page, request }) => {
    // 1. Create booking via API
    const baseUrl = 'http://localhost:4010';

    // Get first event type
    const eventTypesRes = await request.get(`${baseUrl}/event-types`);
    const eventTypes = await eventTypesRes.json();
    const eventTypeId = (eventTypes as any[])[0]?.id;

    if (!eventTypeId) {
      throw new Error('No event types available');
    }

    // Get available slots
    const now = new Date();
    const from = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const to = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const slotsRes = await request.get(
      `${baseUrl}/event-types/${eventTypeId}/slots?from=${from}&to=${to}`
    );
    const slots = await slotsRes.json();
    const availableSlot = (slots as any[]).find((s) => s.available);

    if (!availableSlot) {
      throw new Error('No available slots');
    }

    // Create booking
    const bookingRes = await request.post(`${baseUrl}/bookings`, {
      data: {
        eventTypeId,
        guestName: 'Admin Test User',
        guestEmail: 'admin@test.com',
        guestNotes: 'Test booking via API',
        slotStartAt: availableSlot.startAt,
      },
    });

    expect(bookingRes.status()).toBe(201);

    // 2. Navigate to admin and verify booking appears
    await page.goto('/admin');

    // Verify booking appears in table (use first to avoid strict mode)
    await expect(page.locator('text=Admin Test User').first()).toBeVisible();
    await expect(page.locator('text=admin@test.com').first()).toBeVisible();
  });

  test('should create new event type via form', async ({ page }) => {
    await page.goto('/admin');

    // Wait for form to be visible
    await page.locator('input[placeholder="Консультация"]').waitFor();

    // Fill text inputs
    await page.fill('input[placeholder="Консультация"]', 'Новая услуга');
    await page.fill('input[placeholder="Описание вашей услуги"]', 'Тестовое описание услуги для проверки');

    // Find and fill the number input - get all inputs and find the one with type number
    const allInputs = page.locator('input[type="number"]');
    if (await allInputs.first().isVisible()) {
      await allInputs.first().clear();
      await allInputs.first().fill('30');
    }

    // Submit form
    await page.locator('button:has-text("Создать услугу")').click();

    // Verify new service appears in list
    await expect(page.locator('text=Новая услуга').first()).toBeVisible({ timeout: 10000 });
  });
});
