// BGSI-268: the only place to change how long the admin panel waits before closing an idle session.
// For a demo you can write VITE_IDLE_MINUTES=1 in .env.local (then restart "npm run dev")
const minutes = Number(import.meta.env.VITE_IDLE_MINUTES) || 15

export const IDLE_TIMEOUT_MS = minutes * 60 * 1000
export const IDLE_WARNING_MS = 30 * 1000 // the warning appears 30 s before the end

// Shared by all the tabs of the browser through localStorage
export const LAST_ACTIVITY_KEY = 'bgsi-last-activity'
export const LOGOUT_REASON_KEY = 'bgsi-logout-reason'
