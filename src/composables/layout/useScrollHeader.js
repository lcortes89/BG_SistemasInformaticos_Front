import { onMounted, onUnmounted, ref } from 'vue'

// Pure logic (no window): easy to test with any scroll position (BGSI-210)
//  - at the top             -> normal header
//  - after translucentAt px -> translucent
//  - going down past hideAt -> hidden
//  - going up (any amount)  -> visible again
//  - near the top (atTopUntil px) -> isAtTop: the header snaps into place without animation,
//    otherwise the empty space it leaves at the top of the page shows as a white line
export function createScrollState({ translucentAt = 10, hideAt = 200, atTopUntil = 80 } = {}) {
  const isTranslucent = ref(false)
  const isHidden = ref(false)
  const isAtTop = ref(true)
  let lastY = 0

  function update(y) {
    isTranslucent.value = y > translucentAt
    isAtTop.value = y <= atTopUntil

    if (y <= hideAt || y < lastY) {
      isHidden.value = false
    } else if (y > lastY) {
      isHidden.value = true
    }
    lastY = y
  }

  return { isTranslucent, isHidden, isAtTop, update }
}

// Hook for components: listens to the window scroll while the component is on screen
export function useScrollHeader(options) {
  const state = createScrollState(options)
  const onScroll = () => state.update(window.scrollY)

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return state
}
