import { ref } from 'vue'
import { IDLE_TIMEOUT_MS, IDLE_WARNING_MS, LAST_ACTIVITY_KEY } from '@/core/config/session'

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
const WRITE_EVERY_MS = 1000 // mousemove fires a lot: write the time at most once per second

// BGSI-268: closes the admin session after some time without activity, with a warning before.
// The last activity is saved in localStorage, so activity in any tab keeps every tab open.
export function useIdleLogout({
  onTimeout,
  timeoutMs = IDLE_TIMEOUT_MS,
  warningMs = IDLE_WARNING_MS,
  target = window,
  storage = window.localStorage,
  now = () => Date.now(),
} = {}) {
  const isWarning = ref(false)
  const secondsLeft = ref(Math.ceil(warningMs / 1000))
  let lastWrite = 0
  let timer = null

  function readLastActivity() {
    try {
      return Number(storage.getItem(LAST_ACTIVITY_KEY)) || 0
    } catch {
      return 0 // storage blocked (private mode): only this tab counts
    }
  }

  function writeLastActivity(time) {
    lastWrite = time
    try {
      storage.setItem(LAST_ACTIVITY_KEY, String(time))
    } catch {
      // storage blocked: lastWrite keeps the time for this tab
    }
  }

  // Any activity (or "Seguir conectada") starts the count again
  function markActivity() {
    const time = now()
    if (time - lastWrite >= WRITE_EVERY_MS || isWarning.value) writeLastActivity(time)
    isWarning.value = false
  }

  function check() {
    const lastActivity = Math.max(readLastActivity(), lastWrite)
    const remaining = lastActivity + timeoutMs - now()
    if (remaining <= 0) {
      stop()
      isWarning.value = false
      onTimeout?.()
      return
    }
    isWarning.value = remaining <= warningMs
    secondsLeft.value = Math.ceil(remaining / 1000)
  }

  function start() {
    writeLastActivity(now())
    ACTIVITY_EVENTS.forEach((name) => target.addEventListener(name, markActivity, { passive: true }))
    timer = setInterval(check, 1000)
  }

  function stop() {
    ACTIVITY_EVENTS.forEach((name) => target.removeEventListener(name, markActivity))
    clearInterval(timer)
    timer = null
  }

  return { isWarning, secondsLeft, markActivity, check, start, stop }
}
