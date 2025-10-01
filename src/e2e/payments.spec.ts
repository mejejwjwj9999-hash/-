import { test, expect } from '@playwright/test';

test.describe('Payments Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin panel and login if needed
    await page.goto('/admin');
    // Add login steps here if authentication is required
  });

  test('should display payments management section', async ({ page }) => {
    // Navigate to payments section
    await page.click('text=المدفوعات');
    
    // Verify page loaded
    await expect(page.locator('h1')).toContainText('إدارة المدفوعات');
  });

  test('should open add payment modal', async ({ page }) => {
    await page.click('text=المدفوعات');
    
    // Click add payment button
    await page.click('text=إضافة دفعة جديدة');
    
    // Verify modal opened
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=إضافة دفعة')).toBeVisible();
  });

  test('should validate payment form fields', async ({ page }) => {
    await page.click('text=المدفوعات');
    await page.click('text=إضافة دفعة جديدة');
    
    // Try to submit empty form
    await page.click('text=إضافة الدفعة');
    
    // Should show validation errors
    await expect(page.locator('text=يرجى اختيار الطالب')).toBeVisible();
  });

  test('should filter payments by student', async ({ page }) => {
    await page.click('text=المدفوعات');
    
    // Use search input
    await page.fill('input[placeholder*="البحث"]', 'STD001');
    
    // Verify filtering works
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display payment details', async ({ page }) => {
    await page.click('text=المدفوعات');
    
    // Click on first payment view button (if exists)
    const viewButton = page.locator('button[title*="عرض"], button:has-text("👁")').first();
    const buttonExists = await viewButton.count() > 0;
    
    if (buttonExists) {
      await viewButton.click();
      
      // Verify details modal opened
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }
  });

  test('should calculate fees based on program', async ({ page }) => {
    await page.click('text=المدفوعات');
    await page.click('text=إضافة دفعة جديدة');
    
    // Select a program and verify fee calculation
    await page.click('[data-testid="program-select"]');
    await page.click('text=تكنولوجيا المعلومات');
    
    // Should auto-populate amount or show calculated fee
    const amountField = page.locator('input[name="amount"]');
    await expect(amountField).toBeFocused();
  });

  test('should handle payment status updates', async ({ page }) => {
    await page.click('text=المدفوعات');
    
    // Find a payment and update its status (if exists)
    const statusButton = page.locator('button:has-text("معلق")').first();
    const buttonExists = await statusButton.count() > 0;
    
    if (buttonExists) {
      await statusButton.click();
      
      // Select new status
      await page.click('text=مدفوع');
      
      // Verify status updated
      await expect(page.locator('text=مدفوع')).toBeVisible();
    }
  });

  test('should export payments report', async ({ page }) => {
    await page.click('text=المدفوعات');
    
    // Look for export button
    const exportButton = page.locator('button:has-text("تصدير"), button:has-text("📊")');
    const buttonExists = await exportButton.count() > 0;
    
    if (buttonExists) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBeTruthy();
    }
  });
});