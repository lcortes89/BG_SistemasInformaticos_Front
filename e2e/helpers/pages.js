import { expect } from '@playwright/test'

// BGSI-316: the admin lists have pages. Goes to the next pages until the row with that text is on screen
// (or there are no more pages) and returns the row
export async function findRowInPages(page, text) {
  const row = page.getByRole('row').filter({ hasText: text })
  const pagination = page.getByRole('navigation', { name: 'Paginación' })
  for (;;) {
    if (await row.count()) return row
    if (!(await pagination.isVisible())) return row
    const next = pagination.getByRole('button', { name: 'Siguiente' })
    if (await next.isDisabled()) return row
    const current = Number(await pagination.locator('[aria-current="page"]').innerText())
    await next.click()
    await expect(pagination.locator('[aria-current="page"]')).toHaveText(String(current + 1))
  }
}
