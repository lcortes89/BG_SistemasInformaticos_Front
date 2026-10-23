import { test, expect } from '@playwright/test'

// BGSI-304 / BGSI-310: what the admin inactivates disappears from the website (real backend).
// The website is checked in the product selector of the contact form, which lists the active products.
// The test creates its own brand and product (names start with "0" so they are on the first page)
// and deletes them at the end. The messages are found by their text: while the table reloads,
// its "Cargando..." spinner is a status too
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

async function rowAction(page, name, label) {
  await page.getByRole('row').filter({ hasText: name }).getByRole('button', { name: `Acciones de ${name}` }).click()
  await page.getByRole('menuitem', { name: label }).click()
}

// How many times the product is in the selector of /contacto (waits for the list of products)
async function timesInContactForm(page, product) {
  const loaded = page.waitForResponse((response) => response.url().endsWith('/api/services'))
  await page.goto('/contacto')
  await loaded
  return page.locator('#contact-service option', { hasText: product }).count()
}

// Deleting asks for the password, unless it was typed a moment ago (BGSI-275)
async function deleteRow(page, name) {
  await rowAction(page, name, 'Borrar')
  await page.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  const asked = await dialog.waitFor({ timeout: 3000 }).then(() => true, () => false)
  if (asked) {
    await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
    await dialog.getByRole('button', { name: 'Confirmar' }).click()
  }
  await expect(page.getByRole('row').filter({ hasText: name })).toHaveCount(0)
}

test('an inactive product, or a product of an inactive brand, is not shown on the website', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  const stamp = Date.now()
  const brand = `0 E2E marca ${stamp}`
  const product = `0 E2E producto ${stamp}`

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  // 1. A brand and a product of that brand, both active
  await page.goto('/admin/marcas')
  await page.getByRole('button', { name: '+ Nueva marca' }).click()
  await page.locator('#brand-name').fill(brand)
  await page.locator('#brand-category').fill('Pruebas E2E')
  await page.getByRole('button', { name: 'Guardar marca' }).click()
  await expect(page.getByRole('row').filter({ hasText: brand })).toBeVisible()

  await page.goto('/admin/productos')
  await page.getByRole('button', { name: '+ Nuevo producto' }).click()
  await page.locator('#service-name').fill(product)
  await page.locator('#service-brand').selectOption({ label: brand })
  await expect(page.locator('#service-active')).toBeChecked()
  await page.getByRole('button', { name: 'Guardar producto' }).click()
  await expect(page.getByRole('row').filter({ hasText: product })).toContainText('Activo')
  expect(await timesInContactForm(page, product)).toBe(1)

  // 2. Inactivate the product -> hidden from the website
  await page.goto('/admin/productos')
  await rowAction(page, product, 'Inactivar')
  await expect(page.getByText(`Producto ${product} inactivado: ya no se ve en la web.`)).toBeVisible()
  await expect(page.getByRole('row').filter({ hasText: product })).toContainText('Inactivo')
  expect(await timesInContactForm(page, product)).toBe(0)

  // 3. Activate it again -> shown again
  await page.goto('/admin/productos')
  await rowAction(page, product, 'Activar')
  await expect(page.getByRole('row').filter({ hasText: product })).toContainText('Activo')
  expect(await timesInContactForm(page, product)).toBe(1)

  // 4. Inactivate the brand -> its products are hidden too
  await page.goto('/admin/marcas')
  await rowAction(page, brand, 'Inactivar')
  await expect(page.getByText(`Marca ${brand} inactivada: ni ella ni sus productos se ven en la web.`)).toBeVisible()
  expect(await timesInContactForm(page, product)).toBe(0)

  // 5. Clean up: the product first (a brand with products cannot be deleted)
  await page.goto('/admin/productos')
  await deleteRow(page, product)
  await page.goto('/admin/marcas')
  await deleteRow(page, brand)
})
