<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// BGSI-312: long texts of the tables (message, testimonial, description) show 2 lines + "Ver más"
const props = defineProps({
  text: { type: String, default: '' },
  lines: { type: Number, default: 2 },
})

const box = ref(null)
const isExpanded = ref(false)
const isLong = ref(false) // the text does not fit in the lines: show the link

let observer = null

// Measured with the text cut: if the whole text is taller than the box, it is long
function measure() {
  if (!box.value || isExpanded.value) return
  isLong.value = box.value.scrollHeight > box.value.clientHeight + 1
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(box.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(() => props.text, async () => {
  isExpanded.value = false
  await nextTick()
  measure()
})
</script>

<template>
  <div class="expandable-text">
    <div ref="box" class="expandable-text__body" :class="{ 'expandable-text__body--clamped': !isExpanded }"
         :style="{ '-webkit-line-clamp': lines }">{{ text }}</div>
    <button v-if="isLong || isExpanded" type="button" class="expandable-text__toggle" :aria-expanded="isExpanded"
            data-test="toggle-text" @click="isExpanded = !isExpanded">
      {{ isExpanded ? 'Ver menos ▴' : 'Ver más ▾' }}
    </button>
  </div>
</template>

<style scoped>
.expandable-text__body { white-space: pre-line; overflow-wrap: anywhere; }

.expandable-text__body--clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expandable-text__toggle {
  margin-top: 0.25rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-navy);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.expandable-text__toggle:hover { color: var(--color-orange-dark); text-decoration: underline; }
</style>
