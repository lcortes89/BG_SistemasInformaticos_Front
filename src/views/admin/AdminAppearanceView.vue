<script setup>
import { onMounted } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import ImageUrlField from '@/shared/ImageUrlField.vue'
import HeroPreview from '@/components/admin/HeroPreview.vue'
import { useAdminAppearance } from '@/composables/admin/useAdminAppearance'

const { draftUrl, isLoading, isSaving, error, feedback, isCustom, hasChanges, load, save, reset } = useAdminAppearance()

onMounted(load)
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Apariencia</h1>
        <p>Elige la foto de fondo de las páginas públicas (Soluciones, Tarifas, Clientes y Contacto).</p>
      </div>
    </header>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando apariencia..." />

    <div v-else class="appearance">
      <form class="appearance__card admin-form" novalidate @submit.prevent="save">
        <div class="appearance__status">
          Ahora se muestra:
          <span class="appearance__badge" :class="{ 'appearance__badge--custom': isCustom }">
            {{ isCustom ? 'Foto personalizada' : 'Foto original' }}
          </span>
        </div>

        <ImageUrlField id="hero-image" v-model="draftUrl" label="Foto de fondo" />

        <p class="appearance__tip">
          <strong>Recomendado:</strong> sube la foto desde tu equipo. Con una URL de otra web solo se guarda
          el enlace, y si esa web la borra la página se quedaría sin foto.<br />
          Mejor una foto horizontal de al menos 1600 px de ancho. Se verá desenfocada y con el azul encima.
        </p>

        <p v-if="error" class="admin-form__alert" role="alert">{{ error }}</p>

        <div class="admin-form__actions">
          <button type="button" class="admin-form__cancel" :disabled="!isCustom || isSaving" @click="reset">
            Volver a la foto original
          </button>
          <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSaving || !hasChanges">
            {{ isSaving ? 'Guardando...' : 'Guardar foto' }}
          </button>
        </div>
      </form>

      <div class="appearance__card">
        <HeroPreview :image-url="draftUrl" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.appearance {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  max-width: 1000px;
  gap: 1.5rem;
  align-items: start;

  &__card {
    padding: 1.75rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);
  }

  &__status { display: flex; align-items: center; gap: 0.5rem; color: var(--color-muted); }

  &__badge {
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    background: var(--color-bg-alt);
    color: var(--color-navy);
    font-size: 0.85rem;
    font-weight: 600;

    &--custom { background: rgba(242, 140, 40, 0.15); color: var(--color-orange-dark); }
  }

  &__tip { margin: 0; font-size: 0.85rem; color: var(--color-muted); }
}

.admin-form__cancel:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 900px) {
  .appearance { grid-template-columns: 1fr; }
}
</style>
