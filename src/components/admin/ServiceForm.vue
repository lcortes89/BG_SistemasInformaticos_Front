<script setup>
import { reactive } from 'vue'
import ImageUrlField from '@/shared/ImageUrlField.vue'
import { linesToList } from '@/core/mappers/service/service-mapper'

// Same limits as the backend (ServiceRequestDTO, BGSI-205)
const MAX_ITEMS = 6

const props = defineProps({
  service: { type: Object, default: null }, // ServiceModel when editing, null when creating
  brands: { type: Array, required: true }, // BrandModel[] for the selector
  isSaving: { type: Boolean, default: false },
  serverError: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: props.service?.name ?? '',
  brandId: props.service?.brandId ?? '',
  description: props.service?.description ?? '',
  imageUrl: props.service?.imageUrl ?? '',
  featured: props.service?.featured ?? false,
  // BGSI-205: full product sheet. The lists are edited as text, one item per line
  longDescription: props.service?.longDescription ?? '',
  featuresText: (props.service?.features ?? []).join('\n'),
  sectorsText: (props.service?.sectors ?? []).join('\n'),
})
const errors = reactive({})

// Same rules as the backend (ServiceRequestDTO)
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
  else if (form.name.length > 100) errors.name = 'Máximo 100 caracteres'
  if (!form.brandId) errors.brandId = 'Elige la marca del producto'
  if (form.description.length > 255) errors.description = 'Máximo 255 caracteres'
  if (form.imageUrl.length > 255) errors.imageUrl = 'Máximo 255 caracteres'
  if (form.longDescription.length > 2000) errors.longDescription = 'Máximo 2000 caracteres'
  const features = linesToList(form.featuresText)
  if (features.length > MAX_ITEMS) errors.features = `Máximo ${MAX_ITEMS} funciones`
  else if (features.some((line) => line.length > 100)) errors.features = 'Cada función: máximo 100 caracteres'
  const sectors = linesToList(form.sectorsText)
  if (sectors.length > MAX_ITEMS) errors.sectors = `Máximo ${MAX_ITEMS} sectores`
  else if (sectors.some((line) => line.length > 40)) errors.sectors = 'Cada sector: máximo 40 caracteres'
  return Object.keys(errors).length === 0
}

function submit() {
  if (validate()) emit('submit', { ...form })
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="submit">
    <div class="admin-form__field">
      <label for="service-name">Nombre *</label>
      <input id="service-name" v-model="form.name" type="text" :aria-invalid="!!errors.name" />
      <p v-if="errors.name" class="admin-form__error">{{ errors.name }}</p>
    </div>

    <div class="admin-form__field">
      <label for="service-brand">Marca *</label>
      <select id="service-brand" v-model="form.brandId" :aria-invalid="!!errors.brandId">
        <option value="">Selecciona una marca</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
      </select>
      <p v-if="errors.brandId" class="admin-form__error">{{ errors.brandId }}</p>
    </div>

    <div class="admin-form__field">
      <label for="service-description">Descripción</label>
      <textarea id="service-description" v-model="form.description" rows="3" :aria-invalid="!!errors.description"></textarea>
      <p v-if="errors.description" class="admin-form__error">{{ errors.description }}</p>
    </div>

    <ImageUrlField id="service-image" v-model="form.imageUrl" label="Imagen del producto" :error="errors.imageUrl" />

    <!-- BGSI-205: full product sheet shown in Nuestras Soluciones -->
    <div class="admin-form__field">
      <label for="service-long">Descripción completa</label>
      <textarea id="service-long" v-model="form.longDescription" rows="4"
                :aria-invalid="!!errors.longDescription"></textarea>
      <p v-if="errors.longDescription" class="admin-form__error">{{ errors.longDescription }}</p>
    </div>

    <div class="admin-form__field">
      <label for="service-features">Qué hace (una función por línea, máximo 6)</label>
      <textarea id="service-features" v-model="form.featuresText" rows="4"
                placeholder="Comandas en mesa&#10;Envío a cocina" :aria-invalid="!!errors.features"></textarea>
      <p v-if="errors.features" class="admin-form__error">{{ errors.features }}</p>
    </div>

    <div class="admin-form__field">
      <label for="service-sectors">Ideal para (un sector por línea, máximo 6)</label>
      <textarea id="service-sectors" v-model="form.sectorsText" rows="3"
                placeholder="Bares&#10;Restaurantes" :aria-invalid="!!errors.sectors"></textarea>
      <p v-if="errors.sectors" class="admin-form__error">{{ errors.sectors }}</p>
    </div>

    <label class="admin-form__check">
      <input id="service-featured" v-model="form.featured" type="checkbox" />
      Destacado en la página de Inicio
    </label>

    <p v-if="serverError" class="admin-form__alert" role="alert">{{ serverError }}</p>

    <div class="admin-form__actions">
      <button type="button" class="admin-form__cancel" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSaving">
        {{ isSaving ? 'Guardando...' : 'Guardar producto' }}
      </button>
    </div>
  </form>
</template>
