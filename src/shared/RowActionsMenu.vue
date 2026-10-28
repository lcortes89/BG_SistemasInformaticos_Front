<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import ActionIcon from '@/shared/ActionIcon.vue'

// BGSI-312: "⋯" button of a table row. The list of actions opens over the page (Teleport),
// so the table does not cut it, and upwards when it does not fit below.
// items: [{ key, label, icon, danger? }] -> emits select(key)
const props = defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Acciones' }, // read by screen readers, e.g. "Acciones de Marta Gómez"
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const button = ref(null)
const menu = ref(null)
const position = ref({ top: 0, left: 0 })

// The dangerous actions (Borrar) go at the end, after a line
const normalItems = computed(() => props.items.filter((item) => !item.danger))
const dangerItems = computed(() => props.items.filter((item) => item.danger))

const GAP = 6

function place() {
  if (!button.value) return
  const rect = button.value.getBoundingClientRect()
  const menuEl = menu.value
  const width = menuEl?.offsetWidth || 220
  const height = menuEl?.offsetHeight || 0
  const fitsBelow = rect.bottom + GAP + height <= window.innerHeight
  position.value = {
    top: fitsBelow || rect.top - GAP - height < 0 ? rect.bottom + GAP : rect.top - GAP - height,
    left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
  }
}

function menuItems() {
  return [...(menu.value?.querySelectorAll('[role="menuitem"]') ?? [])]
}

async function open() {
  if (props.disabled) return
  isOpen.value = true
  await nextTick()
  place()
  menuItems()[0]?.focus({ preventScroll: true })
  document.addEventListener('pointerdown', onOutside, true)
  // Scrolling or turning the phone moves the menu with its button (closing it would lose the tap on mobile)
  window.addEventListener('scroll', place, true)
  window.addEventListener('resize', place)
}

function close() {
  if (!isOpen.value) return
  isOpen.value = false
  document.removeEventListener('pointerdown', onOutside, true)
  window.removeEventListener('scroll', place, true)
  window.removeEventListener('resize', place)
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function onOutside(event) {
  if (menu.value?.contains(event.target) || button.value?.contains(event.target)) return
  close()
}

function choose(key) {
  close()
  button.value?.focus()
  emit('select', key)
}

// Arrows move between the options, Esc closes and goes back to the button, Tab leaves the menu
function onKeydown(event) {
  const items = menuItems()
  const index = items.indexOf(document.activeElement)
  const focus = (item) => item?.focus({ preventScroll: true })
  if (event.key === 'ArrowDown') focus(items[(index + 1) % items.length])
  else if (event.key === 'ArrowUp') focus(items[(index - 1 + items.length) % items.length])
  else if (event.key === 'Home') focus(items[0])
  else if (event.key === 'End') focus(items[items.length - 1])
  else if (event.key === 'Escape') {
    close()
    button.value?.focus()
  } else if (event.key === 'Tab') close()
  else return
  if (event.key !== 'Tab') event.preventDefault()
}

onBeforeUnmount(close)
</script>

<template>
  <div class="row-actions">
    <button ref="button" type="button" class="row-actions__toggle" :class="{ 'row-actions__toggle--open': isOpen }"
            :aria-label="label" aria-haspopup="menu" :aria-expanded="isOpen" :disabled="disabled"
            data-test="row-actions" @click="toggle">
      <span aria-hidden="true">⋯</span>
    </button>

    <Teleport to="body">
      <div v-if="isOpen" ref="menu" class="row-actions__menu" role="menu" :aria-label="label"
           :style="{ top: `${position.top}px`, left: `${position.left}px` }" @keydown="onKeydown">
        <button v-for="item in normalItems" :key="item.key" type="button" role="menuitem" class="row-actions__item"
                :data-test="`action-${item.key}`" @click="choose(item.key)">
          <ActionIcon :name="item.icon" /> {{ item.label }}
        </button>
        <div v-if="normalItems.length && dangerItems.length" class="row-actions__separator" role="separator" />
        <button v-for="item in dangerItems" :key="item.key" type="button" role="menuitem"
                class="row-actions__item row-actions__item--danger" :data-test="`action-${item.key}`"
                @click="choose(item.key)">
          <ActionIcon :name="item.icon" /> {{ item.label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.row-actions__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #d6dbe3;
  border-radius: 8px;
  background: #fff;
  color: var(--color-navy);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover { border-color: var(--color-navy); }
  &:focus-visible,
  &--open { border-color: var(--color-navy); box-shadow: 0 0 0 3px rgba(11, 31, 58, 0.12); outline: none; }
  &:disabled { opacity: 0.5; cursor: wait; }
}

.row-actions__menu {
  position: fixed;
  z-index: 60;
  min-width: 220px;
  padding: 6px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(11, 31, 58, 0.18);
  animation: row-actions-in 0.12s ease-out;
}

.row-actions__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--color-text);
  font: inherit;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;

  :deep(.action-icon) { color: var(--color-muted); }

  &:hover,
  &:focus-visible { background: var(--color-bg-alt); outline: none; }

  &--danger,
  &--danger :deep(.action-icon) { color: #b91c1c; }
  &--danger:hover,
  &--danger:focus-visible { background: #fef2f2; }
}

.row-actions__separator { height: 1px; margin: 5px 4px; background: #eef0f3; }

@keyframes row-actions-in {
  from { opacity: 0; transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .row-actions__menu { animation: none; }
}
</style>
