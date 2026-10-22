import { test, expect } from '@playwright/test'

// BGSI-297 + BGSI-298: the panel menu by groups, with the ☰ button on the mobile (real backend)
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('the panel opens on the Resumen and the menu goes to a page of a group', async ({ page, isMobile }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByText('Panel de Control Integral')).toBeVisible()

  const menu = page.getByRole('navigation', { name: 'Navegación de administración' })
  if (isMobile) {
    // The menu is closed and the session is inside it
    await expect(menu).toBeHidden()
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await expect(menu.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
  }

  // Only the titles are shown; a title opens its pages
  await expect(menu.getByRole('link', { name: 'Marcas' })).toBeHidden()
  await menu.getByRole('button', { name: 'Gestión comercial' }).click()
  await menu.getByRole('link', { name: 'Marcas' }).click()

  await expect(page).toHaveURL(/\/admin\/marcas$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Marcas')
  if (isMobile) await expect(menu).toBeHidden() // it closes after choosing a page
})
