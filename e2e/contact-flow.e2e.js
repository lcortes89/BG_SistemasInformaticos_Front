import { test, expect } from '@playwright/test'

// BGSI-175: visitor sends a contact -> the admin sees the lead and marks it as contacted.
// One unique name per run, so the test finds its own contact among the real ones
const visitor = {
  name: `E2E Test ${Date.now()}`,
  email: 'e2e@example.com',
  phone: '600123123',
  message: 'Mensaje automático del test end-to-end. Se puede archivar.',
}

const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test.describe.configure({ mode: 'serial' }) // step 2 needs the contact of step 1

test('a visitor sends the contact form', async ({ page }) => {
  await page.goto('/contacto')

  await page.locator('#contact-name').fill(visitor.name)
  await page.locator('#contact-email').fill(visitor.email)
  await page.locator('#contact-phone').fill(visitor.phone)
  await page.locator('#contact-message').fill(visitor.message)
  await page.locator('#contact-gdpr').check()
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()

  await expect(page.locator('.contact-form__alert--success')).toContainText('Hemos recibido tu mensaje')
})

test('the admin sees the new lead, marks it as contacted and archives it', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  await page.getByRole('link', { name: 'Contactos' }).click()
  const row = page.locator('tr', { hasText: visitor.name })
  await expect(row).toBeVisible()
  await expect(row).toContainText('Nuevo')

  // The panel shows its own message (the list also has a "loading" status while it reloads)
  const feedback = page.locator('.admin-contacts__feedback')
  await row.getByRole('button', { name: 'Marcar contactado' }).click()
  await expect(feedback).toHaveText('Contacto marcado como contactado')

  // Leave the inbox clean: archive the test contact (asks for confirmation)
  await row.getByRole('button', { name: 'Archivar' }).click()
  await page.locator('.confirm-dialog__confirm').click()
  await expect(feedback).toHaveText('Contacto archivado')
})
