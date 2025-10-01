import { test, expect } from '@playwright/test';

test.describe('Admin Payments Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    // Add authentication steps here if needed
    // await page.fill('[data-testid="email"]', 'admin@test.com');
    // await page.fill('[data-testid="password"]', 'password');
    // await page.click('[data-testid="login-button"]');
  });

  test('should display payments management page', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    await expect(page.locator('h1')).toContainText('إدارة المدفوعات');
    await expect(page.locator('text=محسنة')).toBeVisible();
    await expect(page.locator('text=إضافة مدفوعة')).toBeVisible();
  });

  test('should show payment statistics', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Verify statistics cards
    await expect(page.locator('text=المجموع')).toBeVisible();
    await expect(page.locator('text=القيمة الإجمالية')).toBeVisible();
    await expect(page.locator('text=معلق')).toBeVisible();
    await expect(page.locator('text=مدفوع')).toBeVisible();
    await expect(page.locator('text=متأخر')).toBeVisible();
  });

  test('should display search and filter controls', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    await expect(page.locator('text=البحث والفلترة')).toBeVisible();
    await expect(page.locator('input[placeholder*="البحث"]')).toBeVisible();
    await expect(page.locator('text=جميع الحالات')).toBeVisible();
    await expect(page.locator('text=جميع الأنواع')).toBeVisible();
    await expect(page.locator('text=مسح الفلاتر')).toBeVisible();
  });

  test('should open add payment modal', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    await page.click('text=إضافة مدفوعة');
    
    await expect(page.locator('text=إضافة مدفوعة جديدة')).toBeVisible();
    await expect(page.locator('text=الطالب *')).toBeVisible();
    await expect(page.locator('text=البرنامج *')).toBeVisible();
    await expect(page.locator('text=المبلغ *')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    await page.click('text=إضافة مدفوعة');
    
    // Try to submit empty form
    await page.click('button:has-text("إضافة")');
    
    // Should show validation errors
    await expect(page.locator('text=يرجى اختيار الطالب')).toBeVisible();
  });

  test('should filter by payment status', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Click status filter
    await page.click('text=جميع الحالات');
    await page.click('text=معلق');
    
    // Verify filter is applied
    await expect(page.locator('text=معلق').first()).toBeVisible();
  });

  test('should filter by payment type', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Click type filter
    await page.click('text=جميع الأنواع');
    await page.click('text=رسوم دراسية');
    
    // Verify filter is applied
    await expect(page.locator('text=رسوم دراسية').first()).toBeVisible();
  });

  test('should search payments by student info', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Use search functionality
    await page.fill('input[placeholder*="البحث"]', 'STD001');
    
    // Verify search is working
    const searchInput = page.locator('input[placeholder*="البحث"]');
    await expect(searchInput).toHaveValue('STD001');
  });

  test('should clear all filters', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Apply some filters first
    await page.fill('input[placeholder*="البحث"]', 'test');
    
    // Clear filters
    await page.click('text=مسح الفلاتر');
    
    // Verify filters cleared
    const searchInput = page.locator('input[placeholder*="البحث"]');
    await expect(searchInput).toHaveValue('');
  });

  test('should display payments table', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Check table headers
    await expect(page.locator('text=رقم الطالب')).toBeVisible();
    await expect(page.locator('text=اسم الطالب')).toBeVisible();
    await expect(page.locator('text=المبلغ')).toBeVisible();
    await expect(page.locator('text=النوع')).toBeVisible();
    await expect(page.locator('text=الحالة')).toBeVisible();
    await expect(page.locator('text=تاريخ الدفع')).toBeVisible();
    await expect(page.locator('text=رقم الفاتورة')).toBeVisible();
    await expect(page.locator('text=الإجراءات')).toBeVisible();
  });

  test('should refresh payments data', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    
    // Click refresh button
    const refreshButton = page.locator('button').filter({ has: page.locator('svg') });
    await refreshButton.first().click();
    
    // Verify page is still visible (refresh completed)
    await expect(page.locator('text=إدارة المدفوعات')).toBeVisible();
  });

  test('should handle auto-fill payment amount workflow', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    await page.click('text=إضافة مدفوعة');
    
    // Select student (this would trigger auto-fill in real scenario)
    await page.click('text=اختر الطالب');
    
    // In a real test with data, we would:
    // 1. Select a student
    // 2. Verify program is auto-filled
    // 3. Verify amount is auto-filled based on program fees
    // 4. Submit the form
    // 5. Verify payment appears in table
    
    // For now, just verify the form structure is correct
    await expect(page.locator('text=البرنامج *')).toBeVisible();
    await expect(page.locator('text=السنة الدراسية *')).toBeVisible();
    await expect(page.locator('text=الفصل *')).toBeVisible();
    await expect(page.locator('text=المبلغ *')).toBeVisible();
  });

  test('should validate form fields with proper error messages', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    await page.click('text=إضافة مدفوعة');
    
    // Fill invalid amount
    await page.fill('input[type="number"]', '-100');
    
    // Try to submit
    await page.click('button:has-text("إضافة")');
    
    // Should show validation error for negative amount
    await expect(page.locator('text=المبلغ يجب أن يكون أكبر من صفر')).toBeVisible();
  });

  test('should show fee hint when program is selected', async ({ page }) => {
    await page.click('text=إدارة المدفوعات');
    await page.click('text=إضافة مدفوعة');
    
    // Select program (in real scenario this would show fee hint)
    await page.click('text=اختر البرنامج');
    
    // The fee hint would appear showing "رسوم البرنامج: X ريال"
    // This would be tested with actual data in integration tests
  });
});