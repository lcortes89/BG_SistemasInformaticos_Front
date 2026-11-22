import { onScopeDispose, ref } from 'vue'

// BGSI-330: true while the media query matches, e.g. useMediaQuery('(max-width: 560px)') on phones.
// It follows the changes (turning the phone, resizing the window) and stops listening when the component goes away
export function useMediaQuery(query) {
  const matches = ref(false)
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return matches

  const mediaQuery = window.matchMedia(query)
  matches.value = mediaQuery.matches
  const onChange = (event) => { matches.value = event.matches }
  mediaQuery.addEventListener('change', onChange)
  onScopeDispose(() => mediaQuery.removeEventListener('change', onChange))

  return matches
}
