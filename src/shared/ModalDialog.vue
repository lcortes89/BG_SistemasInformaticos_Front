<script setup>
defineProps({
  title: { type: String, required: true },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal" @click.self="emit('close')" @keydown.esc="emit('close')">
    <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header class="modal__header">
        <h2 id="modal-title">{{ title }}</h2>
        <button type="button" class="modal__close" aria-label="Cerrar" @click="emit('close')">×</button>
      </header>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(11, 31, 58, 0.45);

  &__box {
    width: 100%;
    max-width: 560px;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    padding: 1.75rem;
    background: #fff;
    border-radius: var(--radius);
    box-shadow: 0 10px 30px rgba(11, 31, 58, 0.2);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;

    h2 { margin: 0; font-size: 1.3rem; color: var(--color-navy); }
  }

  &__close {
    font-size: 1.75rem;
    line-height: 1;
    color: var(--color-muted);
    background: none;
    border: 0;
    cursor: pointer;
  }
}
</style>
