<script setup>
import { onMounted } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import RateRuleGroup from '@/components/admin/RateRuleGroup.vue'
import { useAdminRateRules } from '@/composables/admin/useAdminRateRules'

const props = defineProps({
  // Optional: lets the tests pass a fake AdminRateRuleService
  rateRuleService: { type: Object, default: undefined },
})

const { groups, isLoading, error, savingId, feedback, rowErrors, load, save } = useAdminRateRules(props.rateRuleService)

onMounted(load)
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Tarifas</h1>
        <p>Precio mensual = precio base × locales + sumas del resto de respuestas.</p>
      </div>
    </header>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando tarifas..." />
    <p v-else-if="error" class="admin-page__error" role="alert">{{ error }}</p>
    <p v-else-if="groups.length === 0" class="admin-rates__empty">Todavía no hay reglas de precio.</p>
    <div v-else class="admin-rates__grid">
      <RateRuleGroup v-for="group in groups" :key="group.category" :group="group"
                     :saving-id="savingId" :errors="rowErrors" @save="save" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.admin-rates__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.admin-rates__empty { color: var(--color-muted); }

@media (max-width: 560px) {
  .admin-rates__grid { grid-template-columns: 1fr; }
}
</style>
