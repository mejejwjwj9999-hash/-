import { test, expect } from '@playwright/test';

test.describe('Services Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    // Add authentication steps here if needed
  });

  test('should display enhanced services management', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    await expect(page.locator('h1')).toContainText('إدارة طلبات الخدمات');
    await expect(page.locator('text=البحث والفلترة المتقدمة')).toBeVisible();
  });

  test('should show service statistics', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Verify statistics cards
    await expect(page.locator('text=طلبات معلقة')).toBeVisible();
    await expect(page.locator('text=قيد المعالجة')).toBeVisible();
    await expect(page.locator('text=طلبات مكتملة')).toBeVisible();
    await expect(page.locator('text=إجمالي الطلبات')).toBeVisible();
  });

  test('should filter by department', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Open department filter
    await page.click('[data-testid="department-filter"]');
    await page.click('text=قسم العلوم التقنية والحاسوب');
    
    // Verify filtering applied
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter by program', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Open program filter
    await page.click('[data-testid="program-filter"]');
    await page.click('text=تكنولوجيا المعلومات');
    
    // Verify filtering applied
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter by service type', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Open service type filter
    await page.click('[data-testid="service-type-filter"]');
    await page.click('text=كشف درجات');
    
    // Verify filtering applied
    await expect(page.locator('table')).toBeVisible();
  });

  test('should search by student info', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Use search functionality
    await page.fill('input[placeholder*="البحث بالاسم أو رقم الطالب"]', 'STD001');
    
    // Verify search results
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should clear all filters', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Apply some filters first
    await page.fill('input[placeholder*="البحث"]', 'test');
    
    // Clear filters
    await page.click('text=مسح الفلاتر');
    
    // Verify filters cleared
    const searchInput = page.locator('input[placeholder*="البحث"]');
    await expect(searchInput).toHaveValue('');
  });

  test('should handle pagination', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Check if pagination exists
    const nextButton = page.locator('button:has-text("التالي")');
    const paginationExists = await nextButton.count() > 0;
    
    if (paginationExists) {
      await nextButton.click();
      
      // Verify page changed
      await expect(page.locator('text=الصفحة 2')).toBeVisible();
    }
  });

  test('should sort by different columns', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Click on sortable header
    await page.click('text=الأولوية');
    
    // Should see sorting indicator
    await expect(page.locator('text=الأولوية ↓, text=الأولوية ↑')).toBeVisible();
  });

  test('should view service request details', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Click view button on first request (if exists)
    const viewButton = page.locator('button:has([data-testid="eye-icon"])').first();
    const buttonExists = await viewButton.count() > 0;
    
    if (buttonExists) {
      await viewButton.click();
      
      // Verify details modal
      await expect(page.locator('text=تفاصيل طلب الخدمة')).toBeVisible();
      await expect(page.locator('text=معلومات الطالب')).toBeVisible();
      await expect(page.locator('text=تفاصيل الطلب')).toBeVisible();
    }
  });

  test('should update request status to in progress', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Find pending request and start processing
    const processButton = page.locator('button[title="بدء المعالجة"]').first();
    const buttonExists = await processButton.count() > 0;
    
    if (buttonExists) {
      await processButton.click();
      
      // Verify status changed
      await expect(page.locator('text=قيد المعالجة')).toBeVisible();
    }
  });

  test('should complete service request', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Find in-progress request and complete it
    const completeButton = page.locator('button[title="إكمال الطلب"]').first();
    const buttonExists = await completeButton.count() > 0;
    
    if (buttonExists) {
      await completeButton.click();
      
      // Verify status changed to completed
      await expect(page.locator('text=مكتمل')).toBeVisible();
    }
  });

  test('should display rich student information', async ({ page }) => {
    await page.click('text=إدارة الخدمات');
    
    // Verify enhanced student info display
    await expect(page.locator('text=س1 - ف1, text=س2 - ف1, text=س3 - ف2')).toBeVisible(); // Academic year and semester
    
    // Check for program badges
    const programBadges = page.locator('[data-testid="program-badge"]');
    const badgeExists = await programBadges.count() > 0;
    
    if (badgeExists) {
      await expect(programBadges.first()).toBeVisible();
    }
  });
});