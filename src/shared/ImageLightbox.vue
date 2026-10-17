<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

// Big view of an image over the page (BGSI-265). Closes with Esc, the × button or a click outside
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
})

const emit = defineEmits(['close'])
const closeButton = ref(null)
let previousOverflow = ''

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(async () => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden' // the page behind does not scroll
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  closeButton.value?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="lightbox" role="dialog" aria-modal="true" :aria-label="caption || alt" @click.self="emit('close')">
      <figure class="lightbox__box">
        <button ref="closeButton" type="button" class="lightbox__close" aria-label="Cerrar imagen" @click="emit('close')">×</button>
        <img :src="src" :alt="alt" class="lightbox__image" />
        <figcaption v-if="caption" class="lightbox__caption">{{ caption }}</figcaption>
      </figure>
      <p class="lightbox__hint">Pulsa Esc o haz clic fuera de la imagen para cerrar</p>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(5, 15, 30, 0.82);
  animation: lightbox-in 0.2s ease-out;

  &__box {
    position: relative;
    margin: 0;
    padding: 1.5rem;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  }

  &__image {
    display: block;
    max-width: min(900px, 80vw);
    max-height: 70vh;
    object-fit: contain;
  }

  &__caption { margin-top: 0.75rem; text-align: center; font-weight: 700; color: var(--color-navy); }

  &__close {
    position: absolute;
    top: -16px;
    right: -16px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 50%;
    background: var(--color-orange);
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
  }

  &__hint { margin: 0; color: #cbd5e1; font-size: 0.85rem; text-align: center; }
}

@keyframes lightbox-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 560px) {
  .lightbox__box { padding: 1rem; }
  .lightbox__close { top: -12px; right: -8px; }
  .lightbox__image { max-width: 85vw; }
}
</style>
