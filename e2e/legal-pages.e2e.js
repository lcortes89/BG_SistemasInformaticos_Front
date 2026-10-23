import { test, expect } from '@playwright/test'

// BGSI-321: the legal pages have real content and the contact form has the first layer about the data.
// No login needed
test('the footer opens the three legal pages and their index works', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')

  await footer.getByRole('link', { name: 'Aviso legal' }).click()
  await expect(page).toHaveURL(/\/aviso-legal$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aviso legal')
  await expect(page.locator('#titular')).toContainText('BG Sistemas Informáticos')

  await footer.getByRole('link', { name: 'Política de privacidad' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de privacidad')
  await page.getByRole('navigation', { name: 'Índice' }).getByRole('link', { name: 'Tus derechos' }).click()
  await expect(page).toHaveURL(/#derechos$/)
  await expect(page.getByRole('heading', { name: 'Tus derechos' })).toBeInViewport()

  await footer.getByRole('link', { name: 'Política de cookies' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de cookies')
})

test('the contact form shows the basic information about the data', async ({ page }) => {
  await page.goto('/contacto')
  const box = page.getByRole('complementary', { name: 'Información básica sobre protección de datos' })

  await expect(box).toContainText('Responsable')
  await expect(box).toContainText('BG Sistemas Informáticos')
  await expect(page.locator('#contact-gdpr')).not.toBeChecked()
})
