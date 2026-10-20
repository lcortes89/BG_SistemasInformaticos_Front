import { test, expect } from '@playwright/test'

// BGSI-275: deleting asks for the password again (real backend). The brand is created by the test itself.
// The name starts with "0" so it is on the first page (brands are sorted by name)
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('deleting a brand asks for the password and then deletes it', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  const name = `0 E2E borrar ${Date.now()}`

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  await page.goto('/admin/marcas')
  await page.getByRole('button', { name: '+ Nueva marca' }).click()
  await page.locator('#brand-name').fill(name)
  await page.locator('#brand-category').fill('Pruebas E2E')
  await page.getByRole('button', { name: 'Guardar marca' }).click()
  const row = page.getByRole('row').filter({ hasText: name })
  await expect(row).toBeVisible()

  await row.getByRole('button', { name: 'Borrar' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()

  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Contraseña', { exact: true }).fill('not-my-password')
  await dialog.getByRole('button', { name: 'Confirmar' }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Contraseña incorrecta')

  await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
  await dialog.getByRole('button', { name: 'Confirmar' }).click()

  await expect(dialog).toBeHidden()
  await expect(page.getByRole('status')).toHaveText(`Marca ${name} borrada`)
  await expect(row).toHaveCount(0)
})
