<script setup>
import defaultImage from '@/assets/images/hero.png'

// BGSI-227: same background for every public view.
// Navy at the top (behind the PageHero) that fades into a blurred photo.
defineProps({
  // Ready to receive another photo (e.g. one chosen from the admin panel)
  image: { type: String, default: defaultImage },
})
</script>

<template>
  <div class="page-backdrop">
    <div class="page-backdrop__image" :style="{ backgroundImage: `url(${image})` }" aria-hidden="true"></div>
    <div class="page-backdrop__fade" aria-hidden="true"></div>

    <div class="page-backdrop__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-backdrop {
  position: relative;
  overflow: hidden;

  // Blurred photo
  &__image {
    position: absolute;
    inset: -20px; // hides the soft edges of the blur
    background-size: cover;
    background-position: center top;
    filter: blur(8px) brightness(0.95) saturate(1.05);
  }

  // Navy behind the hero that becomes transparent and ends in a white veil
  &__fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
      #123461 0,
      #123461 170px,
      rgba(30, 74, 130, 0.7) 290px,
      rgba(70, 120, 190, 0.35) 395px,
      rgba(170, 205, 245, 0.3) 470px,
      rgba(235, 242, 252, 0.45) 610px,
      rgba(245, 248, 252, 0.55) 100%);
  }

  &__content { position: relative; z-index: 1; }
}

// On mobile the text takes more lines: the navy goes further down
@media (max-width: 560px) {
  .page-backdrop__fade {
    background: linear-gradient(to bottom,
      #123461 0,
      #123461 330px,
      rgba(30, 74, 130, 0.7) 430px,
      rgba(70, 120, 190, 0.35) 520px,
      rgba(170, 205, 245, 0.3) 590px,
      rgba(245, 248, 252, 0.55) 100%);
  }
}
</style>
