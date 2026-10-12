<script setup>
import { ref, watch } from 'vue'
import UploadService from '@/core/apis/upload/UploadService'

const props = defineProps({
  modelValue: { type: String, default: '' }, // the image URL (v-model)
  id: { type: String, required: true },
  label: { type: String, default: 'Imagen' },
  error: { type: String, default: null }, // validation error of the parent form
  // Optional: lets the tests pass a fake service
  uploadService: { type: Object, default: () => new UploadService() },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const isUploading = ref(false)
const uploadError = ref(null)
const imageFailed = ref(false)

watch(() => props.modelValue, () => { imageFailed.value = false })

function chooseFile() {
  uploadError.value = null
  fileInput.value?.click()
}

async function onFileSelected(event) {
  const file = event.target.files?.[0]
  event.target.value = '' // lets the same file be chosen again
  if (!file) return

  uploadError.value = null
  isUploading.value = true
  try {
    const url = await props.uploadService.uploadImage(file)
    emit('update:modelValue', url) // the uploaded image fills the same URL field
  } catch (e) {
    uploadError.value = e.message
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="admin-form__field">
    <label :for="id">{{ label }}</label>
    <div class="image-field__row">
      <input
        :id="id"
        :value="modelValue"
        type="url"
        placeholder="Pega una URL o sube un archivo"
        :aria-invalid="!!error"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <button type="button" class="image-field__upload" :disabled="isUploading" @click="chooseFile">
        {{ isUploading ? 'Subiendo...' : 'Subir archivo' }}
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="sr-only"
        :aria-label="`${label}: elegir archivo`"
        @change="onFileSelected"
      />
    </div>
    <p class="image-field__hint">JPG, PNG o WebP · máximo 2 MB</p>
    <p v-if="error" class="admin-form__error">{{ error }}</p>
    <p v-if="uploadError" class="admin-form__error" role="alert">{{ uploadError }}</p>

    <div v-if="modelValue" class="admin-form__preview">
      <img v-if="!imageFailed" :src="modelValue" alt="Vista previa" @error="imageFailed = true" />
      <span v-else>No se puede mostrar la imagen. Revisa la URL.</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-field__row {
  display: flex;
  gap: 0.5rem;

  input { flex: 1; min-width: 0; }
}

.image-field__upload {
  padding: 0 1rem;
  font: inherit;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-navy);
  background: var(--color-bg-alt);
  border: 1px solid #d1d5db;
  border-radius: var(--radius);
  cursor: pointer;

  &:hover:not(:disabled) { border-color: var(--color-orange); }
  &:disabled { opacity: 0.6; cursor: wait; }
}

.image-field__hint { margin: 0; font-size: 0.8rem; color: var(--color-muted); }

@media (max-width: 480px) {
  .image-field__row { flex-direction: column; }
  .image-field__upload { padding: 0.6rem 1rem; }
}
</style>
