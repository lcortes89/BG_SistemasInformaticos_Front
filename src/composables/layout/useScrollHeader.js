import { onMounted, onUnmounted, ref } from 'vue'

// Pure logic (no window): easy to test with any scroll position (BGSI-210)
//  - at the top             -> normal header
//  - after translucentAt px -> translucent
//  - going down past hideAt -> hidden
//  - going up (any amount)  -> visible again
export function createScrollState({ translucentAt = 10, hideAt = 200 } = {}) {
  const isTranslucent = ref(false)
  const isHidden = ref(false)
  let lastY = 0

  function update(y) {
    isTranslucent.value = y > translucentAt

    if (y <= hideAt || y < lastY) {
      isHidden.value = false
    } else if (y > lastY) {
      isHidden.value = true
    }
    lastY = y
  }

  return { isTranslucent, isHidden, update }
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
