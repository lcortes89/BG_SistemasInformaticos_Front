import { test, expect } from '@playwright/test'

// BGSI-318: the logo of the panel opens the public website in a new tab and the panel stays open (real backend)
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('the logo of the panel opens the website in a new tab', async ({ page, context }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  const [website] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Ver la web (se abre en una pestaña nueva)' }).click(),
  ])

  await website.waitForLoadState()
  expect(new URL(website.url()).pathname).toBe('/')
  await expect(page).toHaveURL(/\/admin$/) // the panel is still there
  await expect(page.getByText('Panel de Control Integral')).toBeVisible()
})
