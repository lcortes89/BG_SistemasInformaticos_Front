<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ExportService from '@/core/apis/export/ExportService'

// "⬇ Exportar ▾" button of the admin tables: downloads the list as PDF or Excel (BGSI-254)
const props = defineProps({
  resource: { type: String, required: true }, // 'clients' | 'brands' | 'services'
  params: { type: Object, default: () => ({}) }, // the filters of the table, e.g. { brandId: 1 }
  // Optional: lets the tests pass a fake ExportService
  exportService: { type: Object, default: () => new ExportService() },
})

const OPTIONS = [
  { format: 'pdf', label: 'Descargar PDF', hint: 'Para imprimir o enviar', icon: 'PDF' },
  { format: 'xlsx', label: 'Descargar Excel', hint: 'Para trabajar con los datos', icon: 'XLS' },
]

const isOpen = ref(false)
const exportingFormat = ref(null)
const error = ref(null)
const root = ref(null)

async function download(format) {
  error.value = null
  exportingFormat.value = format
  try {
    await props.exportService.download(props.resource, format, props.params)
    isOpen.value = false
  } catch (e) {
    error.value = e.message
  } finally {
    exportingFormat.value = null
  }
}

// Clicking outside the menu or pressing Escape closes it
function closeOnOutsideClick(event) {
  if (root.value && !root.value.contains(event.target)) isOpen.value = false
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick))
</script>

<template>
  <div ref="root" class="export" @keydown.esc="isOpen = false">
    <button type="button" class="export__toggle" aria-haspopup="menu" :aria-expanded="isOpen"
            :disabled="!!exportingFormat" @click="isOpen = !isOpen">
      {{ exportingFormat ? 'Exportando…' : '⬇ Exportar ▾' }}
    </button>

    <div v-if="isOpen" class="export__menu" role="menu">
      <button v-for="option in OPTIONS" :key="option.format" type="button" role="menuitem" class="export__option"
              :disabled="!!exportingFormat" @click="download(option.format)">
        <span class="export__icon" :class="`export__icon--${option.format}`" aria-hidden="true">{{ option.icon }}</span>
        <span>
          {{ option.label }}
          <small>{{ option.hint }}</small>
        </span>
      </button>
    </div>

    <p v-if="error" class="export__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.export {
  position: relative;

  &__toggle {
    padding: 0.65rem 1rem;
    border: 1px solid #d5dce6;
    border-radius: var(--radius);
    background: #fff;
    color: var(--color-navy);
    font: inherit;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;

    &:disabled { opacity: 0.6; cursor: wait; }
  }

  &__menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 20;
    min-width: 230px;
    padding: 0.4rem;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(11, 31, 58, 0.18);
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.6rem 0.7rem;
    border: 0;
    border-radius: 8px;
    background: none;
    color: var(--color-navy);
    font: inherit;
    text-align: left;
    cursor: pointer;

    &:hover,
    &:focus-visible { background: #f1f5f9; }

    small { display: block; color: var(--color-muted); font-size: 0.75rem; }
  }

  &__icon {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;

    &--pdf { background: #d93025; }
    &--xlsx { background: #1d6f42; }
  }

  &__error {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 230px;
    margin: 0;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    background: #fee2e2;
    color: #7f1d1d;
    font-size: 0.85rem;
  }
}
</style>
