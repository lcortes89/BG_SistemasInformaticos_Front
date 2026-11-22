import { execFileSync } from 'node:child_process'

// BGSI-240: new admins stay PENDING until they open the verification email, and the E2E cannot read that email.
// Only for the E2E on this computer: it activates the admin directly in the Docker MySQL (never in production)
const CONTAINER = process.env.E2E_DB_CONTAINER || 'bgsistemas-db'
const { E2E_DB_USER, E2E_DB_PASSWORD } = process.env

export function activateAdmin(email) {
  if (!/^[\w.+-]+@[\w.-]+$/.test(email)) throw new Error(`Unexpected email: ${email}`)
  execFileSync('docker', [
    'exec', CONTAINER, 'mysql', `-u${E2E_DB_USER}`, `-p${E2E_DB_PASSWORD}`, 'bgsistemas',
    '-e', `UPDATE users SET status = 'ACTIVE' WHERE email = '${email}'`,
  ], { stdio: 'pipe' })
}
