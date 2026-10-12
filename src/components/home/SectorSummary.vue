<script setup>
const offers = [
  { title: 'Software TPV y de gestión', text: 'BDP para hostelería y AHORA One como ERP para tu empresa.' },
  { title: 'Cobro automático', text: 'Máquinas CashGuard: efectivo seguro y sin descuadres de caja.' },
  { title: 'Robots de servicio', text: 'Robots PUDU que llevan los platos a las mesas.' },
]
</script>

<template>
  <section class="summary">
    <div class="container">
      <h2 class="summary__title">Lo que ofrecemos al sector</h2>
      <div class="summary__grid">
        <div v-for="offer in offers" :key="offer.title" class="summary__item">
          <h3>{{ offer.title }}</h3>
          <p>{{ offer.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.summary {
  padding: 4rem 0;

  &__title { margin: 0 0 2rem; text-align: center; color: var(--color-navy); }
  &__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }

  &__item {
    h3 { margin: 0 0 0.5rem; color: var(--color-navy); }
    p { margin: 0; color: var(--color-muted); }
  }
}

@media (max-width: 768px) {
  .summary__grid { grid-template-columns: 1fr; }
}
</style>
