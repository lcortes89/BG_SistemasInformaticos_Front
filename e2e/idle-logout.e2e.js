import { test, expect } from '@playwright/test'

// BGSI-268: with a fake clock, the minutes without activity pass in a moment.
// The time is read from the app itself, so the test works with 15 minutes or with VITE_IDLE_MINUTES=1
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('the panel warns and closes the session after the minutes without activity', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')

  await page.clock.install()
  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  const timeout = await page.evaluate(async () => (await import('/src/core/config/session.js')).IDLE_TIMEOUT_MS)

  await page.clock.runFor(timeout - 20_000) // 20 seconds left
  const warning = page.getByRole('alertdialog')
  await expect(warning).toContainText('¿Sigues ahí?')

  await page.getByRole('button', { name: 'Seguir conectada' }).click()
  await expect(warning).toBeHidden()

  await page.clock.runFor(timeout + 1_000)
  await expect(page).toHaveURL(/\/admin\/login\?reason=idle/)
  await expect(page.getByRole('status')).toHaveText('Tu sesión se ha cerrado por inactividad. Vuelve a iniciar sesión.')

  await page.goBack() // the panel asks for the login again
  await expect(page).toHaveURL(/\/admin\/login/)
})
