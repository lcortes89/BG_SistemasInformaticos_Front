import { test, expect } from '@playwright/test'

// BGSI-175: visitor sends a contact -> the admin sees the lead and marks it as contacted.
// BGSI-308 / BGSI-312: the actions are in the "⋯" menu of the row, and at the end the test contact is deleted.
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

// Opens the "⋯" of the row and chooses an action
async function rowAction(page, row, label) {
  await row.getByRole('button', { name: /^Acciones de/ }).click()
  await page.getByRole('menuitem', { name: label }).click()
}

test('the admin sees the new lead, marks it as contacted, archives it and deletes it', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  // BGSI-297: "Contactos" is inside the "Gestión de clientes" group of the menu
  await page.goto('/admin/contactos')
  const row = page.locator('tr', { hasText: visitor.name })
  await expect(row).toBeVisible()
  await expect(row).toContainText('Nuevo')

  // The panel shows its own message (the list also has a "loading" status while it reloads)
  const feedback = page.locator('.admin-contacts__feedback')
  await rowAction(page, row, 'Marcar contactado')
  await expect(feedback).toHaveText('Contacto marcado como contactado')

  // Archive it (asks for confirmation)
  await rowAction(page, row, 'Archivar')
  await page.locator('.confirm-dialog__confirm').click()
  await expect(feedback).toHaveText('Contacto archivado')

  // Leave the inbox clean: delete it for good ("¿Seguro?" and the password)
  await rowAction(page, row, 'Borrar')
  await page.getByRole('alertdialog').getByRole('button', { name: 'Borrar para siempre' }).click()
  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
  await dialog.getByRole('button', { name: 'Confirmar' }).click()
  await expect(feedback).toHaveText(`Contacto de ${visitor.name} borrado`)
  await expect(row).toHaveCount(0)
})
