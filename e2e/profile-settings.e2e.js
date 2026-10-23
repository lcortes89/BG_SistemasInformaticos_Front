import { test, expect } from '@playwright/test'

// BGSI-314: "Ajustes de perfil" has three pages: Cambiar contraseña, Cambiar email and Verificación en dos pasos
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('the three pages of Ajustes de perfil are reached from the menu', async ({ page, isMobile }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  const menu = page.getByRole('navigation', { name: 'Navegación de administración' })
  const pages = [
    ['Cambiar contraseña', /\/admin\/cambiar-contrasena$/],
    ['Cambiar email', /\/admin\/cambiar-email$/],
    ['Verificación en dos pasos', /\/admin\/verificacion-dos-pasos$/],
  ]
  for (const [label, url] of pages) {
    if (isMobile) await page.getByRole('button', { name: 'Abrir menú' }).click()
    const link = menu.getByRole('link', { name: label })
    // The group is closed on the Resumen; after that it stays open on its pages
    if (!(await link.isVisible())) await menu.getByRole('button', { name: 'Ajustes de perfil' }).click()
    await link.click()

    await expect(page).toHaveURL(url)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(label)
  }

  // The old address of "Mi cuenta" still works
  await page.goto('/admin/mi-cuenta')
  await expect(page).toHaveURL(/\/admin\/cambiar-contrasena$/)
})
