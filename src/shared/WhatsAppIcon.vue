<script setup>
import { useId } from 'vue'

// Green WhatsApp app icon (BGSI-242). Decorative: the link next to it carries the text
defineProps({
  size: { type: Number, default: 22 },
})

// Each icon needs its own gradient id, or two icons on the same page would share it
const gradientId = `wa-gradient-${useId()}`
</script>

<template>
  <svg class="whatsapp-icon" viewBox="0 0 24 24" :width="size" :height="size" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5FD86B" />
        <stop offset="1" stop-color="#25B53B" />
      </linearGradient>
    </defs>
    <!-- Bubble with its tail: green inside, white border -->
    <path d="M5.21 18.29 L3 21 L7.94 20.2 A9.6 9.6 0 1 0 5.21 18.29 Z" :fill="`url(#${gradientId})`"
          stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
    <!-- White phone -->
    <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
  </svg>
</template>

<style scoped>
.whatsapp-icon { flex-shrink: 0; }
</style>
