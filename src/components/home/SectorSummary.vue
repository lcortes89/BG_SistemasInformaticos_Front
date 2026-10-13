<template>
  <!-- BGSI-223: value proposition under the Hero (text from the prototype) -->
  <section class="summary" aria-labelledby="summary-title">
    <div class="container summary__content">
      <p class="summary__eyebrow">Propuesta de valor</p>
      <h2 id="summary-title" class="summary__title">Resumen que ofrecemos al sector</h2>
      <p class="summary__text">
        Soluciones integrales de digitalización y gestión adaptadas a hostelería y comercio.
        Automatizamos cobros, optimizamos la toma de pedidos y sincronizamos la administración
        de tu negocio para multiplicar la rentabilidad y el control.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.summary {
  padding: 4rem 0;

  &__content {
    max-width: 760px;
    text-align: center;
  }

  // Orange label with a line on each side
  &__eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 0;
    color: var(--color-orange);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    &::before,
    &::after {
      content: '';
      width: 40px;
      height: 1px;
      background: var(--color-orange);
    }
  }

  &__title { margin: 0.5rem 0 1rem; color: var(--color-navy); }
  &__text { margin: 0; color: var(--color-muted); line-height: 1.7; }
}
</style>
