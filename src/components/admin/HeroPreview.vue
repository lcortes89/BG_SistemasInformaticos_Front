<script setup>
import { computed } from 'vue'
import defaultImage from '@/assets/images/hero.png'

// Small copy of the public hero to see the photo before saving it (BGSI-230)
const props = defineProps({
  imageUrl: { type: String, default: '' }, // empty = default photo
})

const photo = computed(() => props.imageUrl || defaultImage)
</script>

<template>
  <figure class="hero-preview">
    <div class="hero-preview__frame">
      <div class="hero-preview__image" :style="{ backgroundImage: `url(${photo})` }" aria-hidden="true"></div>
      <div class="hero-preview__fade" aria-hidden="true"></div>
      <div class="hero-preview__content">
        <span class="hero-preview__eyebrow">Calculador inteligente de soluciones</span>
        <strong class="hero-preview__title">Calcula tu tarifa</strong>
        <span class="hero-preview__line"></span>
        <span class="hero-preview__line hero-preview__line--short"></span>
        <span class="hero-preview__card"></span>
      </div>
    </div>
    <figcaption class="hero-preview__caption">Vista previa de una página pública</figcaption>
  </figure>
</template>

<style scoped lang="scss">
.hero-preview {
  margin: 0;

  &__frame {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 10;
    border-radius: 10px;
    background: #fff;
    box-shadow: inset 0 0 0 1px rgba(11, 31, 58, 0.08);
  }

  // Same look as PageBackdrop, at a smaller scale
  &__image {
    position: absolute;
    inset: -10px;
    background-size: cover;
    background-position: center top;
    filter: blur(4px) brightness(0.95) saturate(1.05);
  }

  &__fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
      #123461 0%, #123461 25%, rgba(30, 74, 130, 0.7) 42%,
      rgba(70, 120, 190, 0.35) 58%, rgba(170, 205, 245, 0.3) 70%, rgba(245, 248, 252, 0.6) 100%);
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 9% 8% 0;
    color: #fff;
  }

  &__eyebrow {
    align-self: flex-start;
    padding: 0.15rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 999px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__title { font-size: 1.2rem; }

  &__line {
    width: 70%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.55);

    &--short { width: 45%; }
  }

  // The white card of the page (wizard, form...) sitting on the photo
  &__card {
    width: 84%;
    height: 90px;
    margin: 0.9rem auto 0;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &__caption { margin-top: 0.5rem; font-size: 0.8rem; color: var(--color-muted); text-align: center; }
}
</style>
