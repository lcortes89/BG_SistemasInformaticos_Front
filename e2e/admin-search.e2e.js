import { test, expect } from '@playwright/test'

// BGSI-302: the search box and the status filter of the admin lists (real backend).
// The test creates its own brand, finds it with the search box (it does not need to be on the first page)
// and deletes it at the end
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('finds a brand with the search box, filters by status and clears the filters', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  const stamp = Date.now()
  const brand = `E2E busca ${stamp}`
  const row = page.getByRole('row').filter({ hasText: brand })
  const search = page.getByRole('searchbox')

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  // 1. A new active brand
  await page.goto('/admin/marcas')
  await page.getByRole('button', { name: '+ Nueva marca' }).click()
  await page.locator('#brand-name').fill(brand)
  await page.locator('#brand-category').fill('Pruebas E2E')
  await page.getByRole('button', { name: 'Guardar marca' }).click()
  await expect(page.getByText('Marca creada')).toBeVisible()

  // 2. The search box finds it, without caring about upper or lower case
  await search.fill(`busca ${stamp}`.toUpperCase())
  await expect(row).toBeVisible()
  await expect(page.getByText('1 marca', { exact: true })).toBeVisible() // only this brand

  // 3. It is active, so with "Inactivos" nothing matches
  await page.getByLabel('Estado').selectOption({ label: 'Inactivos' })
  await expect(page.getByText('No hay marcas que coincidan con la búsqueda.')).toBeVisible()

  // 4. "Limpiar filtros" shows the whole list again
  await page.locator('[data-test="filter-no-results"]').getByRole('button', { name: 'Limpiar filtros' }).click()
  await expect(search).toHaveValue('')
  await expect(page.getByLabel('Estado').locator('option:checked')).toHaveText('Todos los estados')
  await expect(page.getByRole('button', { name: '✕ Limpiar filtros' })).toHaveCount(0)

  // 5. Clean up: find it again and delete it (deleting asks for the password, BGSI-275)
  await search.fill(String(stamp))
  await search.press('Enter')
  await expect(row).toBeVisible()
  await row.getByRole('button', { name: `Acciones de ${brand}` }).click()
  await page.getByRole('menuitem', { name: 'Borrar' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  if (await dialog.waitFor({ timeout: 3000 }).then(() => true, () => false)) {
    await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
    await dialog.getByRole('button', { name: 'Confirmar' }).click()
  }
  await expect(page.getByText(`Marca ${brand} borrada`)).toBeVisible()
  await expect(row).toHaveCount(0)
})
