import { test, expect } from '@playwright/test'
import { findRowInPages } from './helpers/pages'

// BGSI-313 / BGSI-316: a list with two pages (real backend). The test creates 7 brands (6 per page)
// whose names start with "0", so they are at the beginning, and deletes them at the end
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

async function deleteBrand(page, name) {
  const row = await findRowInPages(page, name)
  await row.getByRole('button', { name: `Acciones de ${name}` }).click()
  await page.getByRole('menuitem', { name: 'Borrar' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
  // The password is asked the first time only (BGSI-275)
  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  if (await dialog.waitFor({ timeout: 3000 }).then(() => true, () => false)) {
    await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
    await dialog.getByRole('button', { name: 'Confirmar' }).click()
  }
  await expect(page.getByText(`Marca ${name} borrada`)).toBeVisible()
}

test('Marcas shows 6 brands per page and the paginator goes to the next one', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  test.setTimeout(90_000) // 7 brands are created and deleted
  const stamp = Date.now()
  const names = [1, 2, 3, 4, 5, 6, 7].map((n) => `0 E2E pag ${stamp} ${n}`)

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  await page.goto('/admin/marcas')
  for (const name of names) {
    await page.getByRole('button', { name: '+ Nueva marca' }).click()
    await page.locator('#brand-name').fill(name)
    await page.locator('#brand-category').fill('Pruebas E2E')
    await page.getByRole('button', { name: 'Guardar marca' }).click()
    await expect(page.locator('#brand-name')).toBeHidden() // the form closes when it is saved
  }

  // Page 1: 6 rows and the paginator
  await page.goto('/admin/marcas')
  const pagination = page.getByRole('navigation', { name: 'Paginación' })
  await expect(pagination).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(6)
  await expect(pagination.locator('[aria-current="page"]')).toHaveText('1')

  // The 7th brand is on another page
  await expect(page.getByRole('row').filter({ hasText: names[6] })).toHaveCount(0)
  await pagination.getByRole('button', { name: 'Siguiente' }).click()
  await expect(pagination.locator('[aria-current="page"]')).toHaveText('2')
  await expect(page.locator('tbody tr').first()).toBeVisible()

  // Clean up
  for (const name of names) {
    await page.goto('/admin/marcas')
    await deleteBrand(page, name)
  }
})
