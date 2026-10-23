<script setup>
import { reactive } from 'vue'
import ImageUrlField from '@/shared/ImageUrlField.vue'

const TESTIMONIAL_MAX = 1000

const props = defineProps({
  client: { type: Object, default: null }, // ClientModel when editing, null when creating
  isSaving: { type: Boolean, default: false },
  serverError: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: props.client?.name ?? '',
  businessType: props.client?.businessType ?? '',
  testimonial: props.client?.testimonial ?? '',
  logoUrl: props.client?.logoUrl ?? '',
  rating: props.client?.rating ?? 5,
  published: props.client?.published ?? true,
})
const errors = reactive({})

// Same rules as the backend (ClientRequestDTO) - BGSI-137 required fields
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
  else if (form.name.length > 100) errors.name = 'Máximo 100 caracteres'
  if (!form.businessType.trim()) errors.businessType = 'El tipo de negocio es obligatorio'
  else if (form.businessType.length > 100) errors.businessType = 'Máximo 100 caracteres'
  if (!form.testimonial.trim()) errors.testimonial = 'El testimonio es obligatorio'
  else if (form.testimonial.length > TESTIMONIAL_MAX) errors.testimonial = `Máximo ${TESTIMONIAL_MAX} caracteres`
  if (form.logoUrl.length > 255) errors.logoUrl = 'Máximo 255 caracteres'
  const rating = Number(form.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = 'La valoración va de 1 a 5'
  return Object.keys(errors).length === 0
}

function submit() {
  if (validate()) emit('submit', { ...form })
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="submit">
    <div class="admin-form__field">
      <label for="client-name">Nombre del negocio *</label>
      <input id="client-name" v-model="form.name" type="text" :aria-invalid="!!errors.name" />
      <p v-if="errors.name" class="admin-form__error">{{ errors.name }}</p>
    </div>

    <div class="admin-form__field">
      <label for="client-type">Tipo de negocio *</label>
      <input id="client-type" v-model="form.businessType" type="text" placeholder="Restaurante, Cafetería, Pub..."
             :aria-invalid="!!errors.businessType" />
      <p v-if="errors.businessType" class="admin-form__error">{{ errors.businessType }}</p>
    </div>

    <div class="admin-form__field">
      <label for="client-testimonial">Testimonio *</label>
      <textarea id="client-testimonial" v-model="form.testimonial" rows="4" :aria-invalid="!!errors.testimonial"></textarea>
      <p class="client-form__counter">{{ form.testimonial.length }} / {{ TESTIMONIAL_MAX }}</p>
      <p v-if="errors.testimonial" class="admin-form__error">{{ errors.testimonial }}</p>
    </div>

    <div class="admin-form__field">
      <label for="client-rating">Valoración *</label>
      <select id="client-rating" v-model.number="form.rating" :aria-invalid="!!errors.rating">
        <option v-for="stars in [5, 4, 3, 2, 1]" :key="stars" :value="stars">
          {{ '★'.repeat(stars) }}{{ '☆'.repeat(5 - stars) }} ({{ stars }})
        </option>
      </select>
      <p v-if="errors.rating" class="admin-form__error">{{ errors.rating }}</p>
    </div>

    <ImageUrlField id="client-logo" v-model="form.logoUrl" label="Logo del cliente" :error="errors.logoUrl" />

    <label class="admin-form__check">
      <input id="client-published" v-model="form.published" type="checkbox" />
      Activo: se ve en la página de Clientes
    </label>

    <p v-if="serverError" class="admin-form__alert" role="alert">{{ serverError }}</p>

    <div class="admin-form__actions">
      <button type="button" class="admin-form__cancel" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSaving">
        {{ isSaving ? 'Guardando...' : 'Guardar cliente' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.client-form__counter { margin: 0; font-size: 0.8rem; text-align: right; color: var(--color-muted); }
</style>
