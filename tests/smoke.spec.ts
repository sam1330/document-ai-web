import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('should load the landing page and show the premium hero', async ({ page }) => {
    await page.goto('/')
    
    // Check for the main hero text
    await expect(page.getByText('Land Your Dream Job with AI')).toBeVisible()
    
    // Check for the Call to Action button
    const getStartedBtn = page.getByRole('link', { name: 'Get Started for Free' })
    await expect(getStartedBtn).toBeVisible()
    
    // Check navigation menu
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign In' }).click()
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('should show FAQ section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible()
  })
})
