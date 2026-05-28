import { test, expect } from '@playwright/test'

test('editor smoke', async ({ page }) => {
  await page.goto('http://localhost:4173')
  await expect(page.locator('[data-ly-editor=true]')).toBeVisible()
})
