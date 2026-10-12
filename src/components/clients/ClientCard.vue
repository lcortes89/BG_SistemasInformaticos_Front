<script setup>
import StarRating from '@/shared/StarRating.vue'

defineProps({
  client: { type: Object, required: true },
})
</script>

<template>
  <article class="client-card">
    <div class="client-card__header">
      <span class="client-card__badge" aria-hidden="true">{{ client.getInitials() }}</span>
      <div>
        <h3 class="client-card__name">{{ client.name }}</h3>
        <p class="client-card__type">{{ client.businessType }}</p>
      </div>
    </div>
    <StarRating :rating="client.rating" />
    <blockquote class="client-card__testimonial">“{{ client.testimonial }}”</blockquote>
  </article>
</template>

<style scoped lang="scss">
.client-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);

  &__header { display: flex; align-items: center; gap: 1rem; }

  &__badge {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    font-weight: 700;
    color: #fff;
    background: var(--color-navy);
    border-radius: 50%;
  }

  &__name { margin: 0; font-size: 1.05rem; color: var(--color-navy); }
  &__type { margin: 0; font-size: 0.875rem; color: var(--color-muted); }
  &__testimonial { margin: 0; font-style: italic; color: var(--color-text); }
}
</style>
