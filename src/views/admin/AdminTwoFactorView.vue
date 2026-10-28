<script setup>
import AccountPageLayout from '@/components/admin/AccountPageLayout.vue'
import TwoFactorCard from '@/components/admin/TwoFactorCard.vue'

// "Ajustes de perfil > Verificación en dos pasos" (BGSI-314). The card is the one of BGSI-276
defineProps({
  // Optional: lets the tests pass a fake AccountService
  accountService: { type: Object, default: undefined },
})
</script>

<template>
  <AccountPageLayout title="Verificación en dos pasos">
    <template #subtitle>Una protección extra para entrar al panel.</template>

    <TwoFactorCard :service="accountService" hide-title />

    <template #info>
      <ul>
        <li>Es la <strong>mejor protección</strong> para el panel: sin tu móvil nadie puede entrar, aunque sepa tu contraseña.</li>
        <li>Sirve cualquier app de códigos: Google Authenticator, Microsoft Authenticator...</li>
        <li><strong>Guarda los códigos de recuperación</strong>: te dejan entrar si pierdes el móvil.</li>
        <li>Si te quedas sin móvil y sin códigos, otro administrador puede quitártela desde Administradores.</li>
      </ul>
    </template>
  </AccountPageLayout>
</template>
