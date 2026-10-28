<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true }, // 0-based, like the backend
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['change'])

// [0, 1, 2, ...] -> one button per page
const pages = computed(() => Array.from({ length: props.totalPages }, (_, index) => index))

function goTo(pageIndex) {
  if (pageIndex >= 0 && pageIndex < props.totalPages && pageIndex !== props.currentPage) {
    emit('change', pageIndex)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Paginación">
    <button type="button" class="pagination__button" :disabled="currentPage === 0" @click="goTo(currentPage - 1)">
      Anterior
    </button>

    <button
      v-for="pageIndex in pages"
      :key="pageIndex"
      type="button"
      class="pagination__button"
      :class="{ 'pagination__button--active': pageIndex === currentPage }"
      :aria-current="pageIndex === currentPage ? 'page' : null"
      @click="goTo(pageIndex)"
    >
      {{ pageIndex + 1 }}
    </button>

    <button
      type="button"
      class="pagination__button"
      :disabled="currentPage === totalPages - 1"
      @click="goTo(currentPage + 1)"
    >
      Siguiente
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;

  &__button {
    min-width: 40px;
    padding: 0.5rem 0.9rem;
    font-weight: 600;
    color: var(--color-navy);
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
    cursor: pointer;

    &:hover:not(:disabled) { border-color: var(--color-orange); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }

    &--active {
      color: #fff;
      background: var(--color-orange);
      border-color: var(--color-orange);
    }
  }
}
</style>
