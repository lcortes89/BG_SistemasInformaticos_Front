<script setup>
import AccountPageLayout from '@/components/admin/AccountPageLayout.vue'
import ChangeEmailCard from '@/components/admin/ChangeEmailCard.vue'
import { useAuthStore } from '@/stores/auth'

// "Ajustes de perfil > Cambiar email" (BGSI-314). The card is the one of BGSI-301
defineProps({
  // Optional: lets the tests pass a fake AccountService
  accountService: { type: Object, default: undefined },
})

const authStore = useAuthStore()
</script>

<template>
  <AccountPageLayout title="Cambiar email">
    <template #subtitle>Ahora entras con <strong>{{ authStore.email }}</strong>.</template>

    <ChangeEmailCard :current-email="authStore.email" :service="accountService" hide-title />

    <template #info>
      <ul>
        <li>Te enviamos un <strong>enlace al email nuevo</strong>: el cambio se hace cuando lo abres.</li>
        <li>El enlace vale <strong>1 hora</strong>. Hasta entonces sigues entrando con el email de ahora.</li>
        <li>Al confirmarlo se <strong>cierran todas tus sesiones</strong> y entras con el email nuevo.</li>
        <li>Si no te llega, mira en spam o cancela el cambio y pídelo otra vez.</li>
      </ul>
    </template>
  </AccountPageLayout>
</template>
