import { test, expect } from '@playwright/test'

// BGSI-175: the visitor answers every question of Tarifas and gets a monthly price from the backend
test('a visitor calculates a monthly rate', async ({ page }) => {
  await page.goto('/tarifas')

  // "Paso 1 de 4" -> the wizard tells us how many questions it has
  const counter = page.locator('.wizard__counter')
  await expect(counter).toHaveText(/Paso 1 de \d+/)
  const totalSteps = Number((await counter.textContent()).match(/de (\d+)/)[1])

  for (let step = 1; step <= totalSteps; step++) {
    // Wait until the new question has replaced the old one (there is a fade animation between steps)
    await expect(counter).toHaveText(`Paso ${step} de ${totalSteps}`)
    const firstOption = page.locator('.wizard__step').getByRole('radio').first()
    await firstOption.click()
    await expect(firstOption).toHaveAttribute('aria-checked', 'true')
    await page.locator('.wizard__next').click()
  }

  await expect(page.getByText('Tu tarifa estimada')).toBeVisible()
  await expect(page.locator('.result__price')).toContainText('€')
})
