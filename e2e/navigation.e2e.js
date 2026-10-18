import { test, expect } from '@playwright/test'

// BGSI-175: the public pages open and the panel is protected
test('the home page loads the featured products from the backend', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Digitaliza tu negocio hostelero')
  await expect(page.locator('.featured__grid')).toBeVisible() // only when the API answered
})

test('Soluciones shows the products of a brand', async ({ page }) => {
  await page.goto('/soluciones')

  await page.locator('.brand-card__button').first().click()
  await expect(page.locator('.brand-services__title')).toContainText('Productos de')
})

test('a visitor without session cannot open the panel', async ({ page }) => {
  await page.goto('/admin/contactos')

  await expect(page).toHaveURL(/\/admin\/login/)
  await expect(page.locator('#login-email')).toBeVisible()
})

test('an unknown address shows the 404 page', async ({ page }) => {
  await page.goto('/esta-pagina-no-existe')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página no encontrada')
})
