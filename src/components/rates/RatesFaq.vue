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
  <!-- BGSI-224: own light section, so opening an answer never resizes the blurred block above -->
  <section class="faq" aria-labelledby="faq-title">
    <div class="container faq__content">
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

          <!-- The answer is always in the page; the grid row grows from 0 to its real height -->
          <div :id="`faq-answer-${item.id}`" class="faq__panel" :class="{ 'is-open': openId === item.id }"
               role="region" :aria-labelledby="`faq-question-${item.id}`" :aria-hidden="openId !== item.id">
            <div class="faq__panel-inner">
              <p class="faq__answer">{{ item.answer }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.faq {
  padding: 4rem 0;
  // Grey only in the middle: soft white edges, no hard line with the photo or the demo CTA (BGSI-227)
  background: linear-gradient(to bottom, #fff 0, var(--color-bg-alt) 160px, var(--color-bg-alt) calc(100% - 160px), #fff 100%);

  &__content { max-width: 900px; }

  &__eyebrow {
    margin: 0;
    text-align: center;
    color: var(--color-orange);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__title { margin: 0.5rem 0 2rem; text-align: center; color: var(--color-navy); }

  &__list { display: flex; flex-direction: column; gap: 0.75rem; margin: 0; padding: 0; list-style: none; }

  &__item {
    border-radius: var(--radius);
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    border-left: 4px solid transparent;
    transition: border-color 0.35s ease;

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
    transition: transform 0.35s ease;
  }

  .is-open &__icon { transform: rotate(45deg); } // "+" becomes "×"

  // Smooth height: the row goes from 0fr (closed) to 1fr (its real height)
  &__panel {
    display: grid;
    grid-template-rows: 0fr;
    visibility: hidden;
    transition: grid-template-rows 0.35s ease, visibility 0.35s;

    &.is-open { grid-template-rows: 1fr; visibility: visible; }
  }

  &__panel-inner { overflow: hidden; }

  &__answer {
    margin: 0;
    padding: 0 1.25rem 1.1rem;
    color: var(--color-muted);
    line-height: 1.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq__icon, .faq__item, .faq__panel { transition: none; }
}
</style>
