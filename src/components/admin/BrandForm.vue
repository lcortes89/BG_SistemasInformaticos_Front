<script setup>
import { reactive } from 'vue'
import ImageUrlField from '@/shared/ImageUrlField.vue'

const props = defineProps({
  brand: { type: Object, default: null }, // BrandModel when editing, null when creating
  isSaving: { type: Boolean, default: false },
  serverError: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: props.brand?.name ?? '',
  category: props.brand?.category ?? '',
  description: props.brand?.description ?? '',
  logoUrl: props.brand?.logoUrl ?? '',
  active: props.brand?.active ?? true,
})
const errors = reactive({})

// Same rules as the backend (BrandRequestDTO)
function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
  else if (form.name.length > 100) errors.name = 'Máximo 100 caracteres'
  if (!form.category.trim()) errors.category = 'La categoría es obligatoria'
  else if (form.category.length > 100) errors.category = 'Máximo 100 caracteres'
  if (form.description.length > 255) errors.description = 'Máximo 255 caracteres'
  if (form.logoUrl.length > 255) errors.logoUrl = 'Máximo 255 caracteres'
  return Object.keys(errors).length === 0
}

function submit() {
  if (validate()) emit('submit', { ...form })
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="submit">
    <div class="admin-form__field">
      <label for="brand-name">Nombre *</label>
      <input id="brand-name" v-model="form.name" type="text" :aria-invalid="!!errors.name" />
      <p v-if="errors.name" class="admin-form__error">{{ errors.name }}</p>
    </div>

    <div class="admin-form__field">
      <label for="brand-category">Categoría *</label>
      <input id="brand-category" v-model="form.category" type="text" placeholder="Software para hostelería"
             :aria-invalid="!!errors.category" />
      <p v-if="errors.category" class="admin-form__error">{{ errors.category }}</p>
    </div>

    <div class="admin-form__field">
      <label for="brand-description">Descripción</label>
      <textarea id="brand-description" v-model="form.description" rows="3" :aria-invalid="!!errors.description"></textarea>
      <p v-if="errors.description" class="admin-form__error">{{ errors.description }}</p>
    </div>

    <ImageUrlField id="brand-logo" v-model="form.logoUrl" label="Logo" :error="errors.logoUrl" />

    <label class="admin-form__check">
      <input id="brand-active" v-model="form.active" type="checkbox" />
      Activa: se ve en la web pública, con sus productos
    </label>

    <p v-if="serverError" class="admin-form__alert" role="alert">{{ serverError }}</p>

    <div class="admin-form__actions">
      <button type="button" class="admin-form__cancel" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSaving">
        {{ isSaving ? 'Guardando...' : 'Guardar marca' }}
      </button>
    </div>
  </form>
</template>
