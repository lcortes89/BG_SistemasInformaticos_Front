import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// BGSI-298: the ☰ menu of the mobile (public header and admin panel).
// It closes when choosing a page, with Esc or when touching outside of `root` (the header or the sidebar)
export function useMobileMenu(root = ref(null)) {
  const isOpen = ref(false)
  const route = useRoute()

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function close() {
    isOpen.value = false
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && isOpen.value) close()
  }

  function onPointerDown(event) {
    if (isOpen.value && root.value && !root.value.contains(event.target)) close()
  }

  watch(() => route?.fullPath, close)

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('pointerdown', onPointerDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('pointerdown', onPointerDown)
  })

  return { isOpen, toggle, close }
}
