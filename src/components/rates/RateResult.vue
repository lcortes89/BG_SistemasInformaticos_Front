<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  quote: { type: Object, required: true }, // RateQuoteModel
})

defineEmits(['restart'])
</script>

<template>
  <div class="result" role="status">
    <p class="result__label">Tu tarifa estimada</p>
    <p class="result__price">
      {{ quote.getFormattedPrice() }}<span class="result__period">/mes</span>
    </p>
    <p class="result__note">
      Precio orientativo sin IVA. Te preparamos una propuesta exacta sin compromiso.
    </p>
    <div class="result__actions">
      <RouterLink to="/contacto" class="result__cta">Solicitar propuesta</RouterLink>
      <button type="button" class="result__restart" @click="$emit('restart')">Volver a calcular</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result {
  text-align: center;
  padding: 1rem 0;

  &__label { margin: 0; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; }
  &__price { margin: 0.5rem 0; font-size: 3rem; font-weight: 800; color: var(--color-navy); }
  &__period { font-size: 1.25rem; font-weight: 600; color: var(--color-muted); }
  &__note { margin: 0 auto 2rem; max-width: 420px; color: var(--color-muted); }

  &__actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; }

  &__cta {
    padding: 0.85rem 1.75rem;
    border-radius: var(--radius);
    background: var(--color-orange);
    color: #fff;
    font-weight: 700;
    text-decoration: none;
    &:hover { background: var(--color-orange-dark); }
  }

  &__restart {
    padding: 0.85rem 1.75rem;
    border: 2px solid var(--color-navy);
    border-radius: var(--radius);
    background: transparent;
    color: var(--color-navy);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    &:hover { background: var(--color-navy); color: #fff; }
  }
}
</style>
