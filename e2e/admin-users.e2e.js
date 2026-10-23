import { test, expect } from '@playwright/test'

// BGSI-277: invite an admin, send the invitation again and delete it (real backend).
// The invited admin is created by the test itself (example.com never receives mail), so the main admin is not touched
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } = process.env

test('an admin invites another one, sends the invitation again and deletes it', async ({ page }) => {
  test.skip(!E2E_ADMIN_EMAIL || !E2E_ADMIN_PASSWORD, 'Add the admin credentials to .env.e2e.local')
  const email = `e2e-invite-${Date.now()}@example.com`

  await page.goto('/admin/login')
  await page.locator('#login-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#login-password').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  await page.goto('/admin/administradores')
  // Your own row has no buttons, only the link to "Mi cuenta"
  const myRow = page.getByRole('row').filter({ hasText: E2E_ADMIN_EMAIL })
  await expect(myRow.getByText('Tú', { exact: true })).toBeVisible()
  await expect(myRow.getByRole('button')).toHaveCount(0)

  // Invite: the email twice, then the password (BGSI-275)
  await page.getByRole('button', { name: '+ Invitar administrador' }).click()
  await page.locator('#invite-email').fill(email)
  await page.getByRole('button', { name: 'Continuar →' }).click()
  await page.locator('#invite-confirm-email').pressSequentially(email)
  await page.getByRole('button', { name: 'Enviar invitación', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Confirma tu contraseña' })
  await dialog.getByLabel('Contraseña', { exact: true }).fill(E2E_ADMIN_PASSWORD)
  await dialog.getByRole('button', { name: 'Confirmar' }).click()

  await expect(page.getByRole('status')).toHaveText(`Invitación enviada a ${email}. Tiene 24 horas para crear su contraseña.`)
  const row = page.getByRole('row').filter({ hasText: email })
  await expect(row.getByText('Pendiente')).toBeVisible()
  await expect(row.getByText('Nunca')).toBeVisible()

  // Send it again
  // BGSI-312: the actions are in the "⋯" menu of the row
  await row.getByRole('button', { name: `Acciones de ${email}` }).click()
  await page.getByRole('menuitem', { name: 'Reenviar invitación' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Reenviar' }).click()
  await expect(page.getByRole('status')).toHaveText(`Invitación reenviada a ${email}. El enlace anterior ya no sirve.`)

  // Delete it: the password was confirmed less than 5 minutes ago, it is not asked again
  await row.getByRole('button', { name: `Acciones de ${email}` }).click()
  await page.getByRole('menuitem', { name: 'Borrar' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
  await expect(page.getByRole('status')).toHaveText(`${email} se ha borrado.`)
  await expect(row).toHaveCount(0)
})
