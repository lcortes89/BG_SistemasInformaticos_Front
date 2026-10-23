import { test, expect } from '@playwright/test'

// BGSI-320 / BGSI-324: the public footer and the copyright bar of the admin area
test('the public footer has the social networks, WhatsApp and the legal links', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')

  for (const name of ['Facebook', 'Instagram', 'LinkedIn']) {
    await expect(footer.getByRole('link', { name: `${name} de BG Sistemas (se abre en una pestaña nueva)` })).toBeVisible()
  }
  const whatsapp = footer.getByRole('link', { name: /Escríbenos por WhatsApp/ })
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/34615471066\?text=/)
  await expect(footer.getByRole('link', { name: 'Política de privacidad' })).toBeVisible()
  await expect(footer.getByText('Navegación')).toHaveCount(0)
})

test('the admin area only shows the copyright bar', async ({ page }) => {
  await page.goto('/admin/login')
  const footer = page.locator('footer')

  await expect(footer).toHaveText(/© \d{4} BG Sistemas Informáticos\. Todos los derechos reservados\./)
  await expect(footer.getByRole('link')).toHaveCount(0)
})
