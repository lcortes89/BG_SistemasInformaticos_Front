<script setup>
import { ref } from 'vue'

defineProps({
  items: { type: Array, required: true }, // [{ id, question, answer }]
})

// Only one question open at a time (null = all closed)
const openId = ref(null)

function toggle(id) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section class="faq" aria-labelledby="faq-title">
    <p class="faq__eyebrow">Dudas frecuentes</p>
    <h2 id="faq-title" class="faq__title">Preguntas sobre la contratación y tarifas</h2>

    <ul class="faq__list">
      <li v-for="item in items" :key="item.id" class="faq__item" :class="{ 'is-open': openId === item.id }">
        <button type="button" class="faq__question" :id="`faq-question-${item.id}`"
                :aria-expanded="openId === item.id" :aria-controls="`faq-answer-${item.id}`"
                @click="toggle(item.id)">
          <span>{{ item.question }}</span>
          <span class="faq__icon" aria-hidden="true">+</span>
        </button>

        <Transition name="slide-fade">
          <div v-if="openId === item.id" :id="`faq-answer-${item.id}`" class="faq__answer"
               role="region" :aria-labelledby="`faq-question-${item.id}`">
            <p>{{ item.answer }}</p>
          </div>
        </Transition>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.faq {
  max-width: 900px;
  margin: 3rem auto 0;

  &__eyebrow {
    margin: 0;
    text-align: center;
    color: var(--color-orange);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__title { margin: 0.5rem 0 2rem; text-align: center; color: #fff; }

  &__list { display: flex; flex-direction: column; gap: 0.75rem; margin: 0; padding: 0; list-style: none; }

  &__item {
    border-radius: var(--radius);
    background: #fff;
    overflow: hidden;
    border-left: 4px solid transparent;
    transition: border-color 0.2s ease;

    &.is-open { border-left-color: var(--color-orange); }
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1.1rem 1.25rem;
    border: none;
    background: transparent;
    color: var(--color-navy);
    font: inherit;
    font-weight: 700;
    text-align: left;
    cursor: pointer;

    &:focus-visible { outline: 3px solid var(--color-orange); outline-offset: -3px; }
  }

  &__icon {
    flex-shrink: 0;
    font-size: 1.5rem;
    line-height: 1;
    color: var(--color-orange);
    transition: transform 0.2s ease;
  }

  .is-open &__icon { transform: rotate(45deg); } // "+" becomes "×"

  &__answer {
    padding: 0 1.25rem 1.1rem;
    color: var(--color-muted);

    p { margin: 0; line-height: 1.6; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq__icon, .faq__item { transition: none; }
}
</style>
