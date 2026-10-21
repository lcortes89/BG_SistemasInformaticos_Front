import { test, expect } from '@playwright/test'
import { totp } from './helpers/totp'

// BGSI-276: two-step verification with the real backend. The test acts as the phone (helpers/totp.js).
// It never touches the 2FA of the E2E admin: it creates a new admin for itself through the API
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env
const API = process.env.E2E_API_URL || 'http://localhost:8080/api'
const PASSWORD = 'E2eSegura2026'

async function createAdmin(request) {
  const basic = Buffer.from(`${E2E_ADMIN_EMAIL}:${E2E_ADMIN_PASSWORD}`).toString('base64')
  const login = await request.post(`${API}/auth/login`, { headers: { Authorization: `Basic ${basic}` } })
  expect(login.status(), 'The E2E admin must not have 2FA on').toBe(200)
  const auth = { Authorization: `Bearer ${(await login.json()).token}` }

  const confirm = await request.post(`${API}/admin/account/confirm`, { headers: auth, data: { password: E2E_ADMIN_PASSWORD } })
  const { confirmToken } = await confirm.json()

  const email = `e2e-2fa-${Date.now()}@bgsistemas.test`
  const created = await request.post(`${API}/auth/register`, {
    headers: { ...auth, 'X-Confirm-Token': confirmToken }, data: { email, password: PASSWORD },
  })
  expect(created.status()).toBe(201)
  return email
}

async function logIn(page, email) {
  await page.evaluate(() => localStorage.clear())
  await page.goto('/admin/login')
  await page.locator('#login-email').fill(email)
  await page.locator('#login-password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('an admin turns on two-step verification and logs in with the code or a recovery code', async ({ page, request }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  const email = await createAdmin(request)

  await page.goto('/admin/login')
  await logIn(page, email)
  await expect(page).toHaveURL(/\/admin$/)

  // Turn it on: QR + first code
  await page.goto('/admin/mi-cuenta')
  await page.getByRole('button', { name: 'Activar verificación en dos pasos' }).click()
  await expect(page.getByRole('img', { name: /Código QR/ })).toBeVisible()
  const secret = (await page.locator('[data-test="secret"]').textContent()).replace(/\s/g, '')
  await page.locator('#two-factor-code').fill(totp(secret))
  await page.getByRole('button', { name: 'Activar', exact: true }).click()

  // Recovery codes, shown once
  const codes = page.getByRole('list', { name: 'Códigos de recuperación' }).getByRole('listitem')
  await expect(codes).toHaveCount(10)
  const recoveryCode = (await codes.first().textContent()).trim()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar .txt' }).click()
  expect((await download).suggestedFilename()).toBe('bg-sistemas-codigos-recuperacion.txt')
  await page.getByRole('button', { name: 'Ya los he guardado' }).click()
  await expect(page.getByText('Activada', { exact: true })).toBeVisible()

  // The login now asks for the code
  await logIn(page, email)
  await expect(page.getByText('Verificación en dos pasos')).toBeVisible()
  await page.locator('#login-code').fill('000000')
  await page.getByRole('button', { name: 'Verificar y entrar' }).click()
  await expect(page.locator('#login-code-error')).toContainText('Código incorrecto')
  await page.locator('#login-code').fill(totp(secret, 1))
  await page.getByRole('button', { name: 'Verificar y entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  // Without the phone: a recovery code
  await logIn(page, email)
  await page.getByRole('button', { name: /Usa un código de recuperación/ }).click()
  await page.locator('#login-code').fill(recoveryCode)
  await page.getByRole('button', { name: 'Verificar y entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)
})
