<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

// BGSI-302: search box + status of the admin lists (Contactos, Clientes, Productos, Marcas, Administradores).
// The text is sent a moment after the user stops typing (or at once with Enter)
const props = defineProps({
  search: { type: String, default: '' },
  status: { type: [String, Boolean], default: null }, // null = all
  statusOptions: { type: Array, required: true }, // [{ value, label }], the first one is "all" (value null)
  placeholder: { type: String, required: true },
  // Other filters of the page (e.g. the brand in Productos): they also show "Limpiar filtros"
  otherFiltersActive: { type: Boolean, default: false },
  delay: { type: Number, default: 350 },
})

const emit = defineEmits(['update:search', 'update:status', 'clear'])

const text = ref(props.search)
let timer = null

// The parent can change the text (e.g. "Limpiar filtros")
watch(() => props.search, (value) => { if (value !== text.value.trim()) text.value = value })

function sendText() {
  clearTimeout(timer)
  const value = text.value.trim()
  if (value !== props.search) emit('update:search', value)
}

function onInput() {
  clearTimeout(timer)
  timer = setTimeout(sendText, props.delay)
}

onBeforeUnmount(() => clearTimeout(timer))

// v-model of the select with real values (null, true, 'NEW'...), not only strings
const selectedStatus = computed({
  get: () => props.status,
  set: (value) => emit('update:status', value),
})

const hasFilters = computed(() => !!props.search || props.status !== null || props.otherFiltersActive)

function clear() {
  clearTimeout(timer)
  text.value = ''
  emit('clear')
}
</script>

<template>
  <div class="list-filters" role="search">
    <label class="list-filters__search">
      <span class="sr-only">Buscar</span>
      <svg class="list-filters__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input v-model="text" type="search" :placeholder="placeholder" maxlength="100" data-test="filter-search"
             @input="onInput" @keydown.enter.prevent="sendText" />
    </label>

    <slot />

    <label class="list-filters__status">
      <span class="sr-only">Estado</span>
      <select v-model="selectedStatus" data-test="filter-status">
        <option v-for="option in statusOptions" :key="String(option.value)" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <button v-if="hasFilters" type="button" class="list-filters__clear" data-test="filter-clear" @click="clear">
      ✕ Limpiar filtros
    </button>
  </div>
</template>

<style scoped lang="scss">
.list-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 1px 3px rgb(15 23 42 / 0.08);

  &__search {
    position: relative;
    flex: 1 1 260px;

    input {
      width: 100%;
      padding: 0.6rem 0.8rem 0.6rem 2.4rem;
      font: inherit;
      border: 1px solid #d1d5db;
      border-radius: var(--radius);
    }
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 0.8rem;
    width: 1.1rem;
    height: 1.1rem;
    transform: translateY(-50%);
    fill: none;
    stroke: var(--color-muted);
    stroke-width: 2;
    stroke-linecap: round;
  }

  :deep(select) {
    padding: 0.6rem 0.8rem;
    font: inherit;
    color: var(--color-navy);
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
  }

  input:focus,
  :deep(select:focus) { outline: 2px solid var(--color-orange); outline-offset: 1px; }

  &__clear {
    padding: 0.55rem 0.9rem;
    font: inherit;
    font-weight: 600;
    color: var(--color-navy);
    background: transparent;
    border: 1px dashed #cbd5e1;
    border-radius: var(--radius);
    cursor: pointer;

    &:hover { border-color: var(--color-orange); color: var(--color-orange); }
  }

  // Mobile: one filter per row, so the long options are not cut
  @media (max-width: 640px) {
    > * { flex-basis: 100%; }
    :deep(select) { width: 100%; }
  }
}
</style>
