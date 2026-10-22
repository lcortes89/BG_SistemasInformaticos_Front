import { test, expect } from '@playwright/test'

// BGSI-301: change my own email (real backend). The test asks for the change and cancels it,
// so the email of the E2E admin never changes. The link goes to an @example.com address (it does not exist)
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('asks for the change of email with the password and cancels it', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  const newEmail = `e2e-${Date.now()}@example.com`

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  await page.goto('/admin/mi-cuenta')
  const card = page.locator('.change-email')
  const newEmailInput = card.getByLabel('Email nuevo', { exact: true })
  // A change left pending by an older run is cancelled first
  const oldCancel = card.getByRole('button', { name: 'Cancelar el cambio' })
  await expect(newEmailInput.or(oldCancel)).toBeVisible()
  if (await oldCancel.isVisible()) await oldCancel.click()

  await newEmailInput.fill(newEmail)
  await card.getByRole('button', { name: 'Continuar →' }).click()
  await card.getByLabel('Repite el email nuevo').fill(newEmail)
  await card.getByRole('button', { name: 'Enviar enlace' }).click()

  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
  await dialog.getByRole('button', { name: 'Confirmar' }).click()

  await expect(card.locator('[data-test="pending-email"]')).toHaveText(newEmail)
  await expect(card).toContainText('Pendiente de confirmar')

  // Still pending after reloading the page
  await page.reload()
  await expect(card.locator('[data-test="pending-email"]')).toHaveText(newEmail)

  await card.getByRole('button', { name: 'Cancelar el cambio' }).click()
  await expect(card).toContainText('Cambio cancelado')
  await expect(newEmailInput).toBeVisible()
})

test('a link that is not valid does not change anything', async ({ page }) => {
  await page.goto('/admin/confirmar-email?token=not-a-real-token')

  await expect(page.getByRole('heading', { name: 'El enlace no es válido' })).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('Tu email no ha cambiado')
  await page.getByRole('link', { name: 'Ir a iniciar sesión' }).click()
  await expect(page).toHaveURL(/\/admin\/login$/)
})
