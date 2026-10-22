<script setup>
import MailSettingsForm from '@/components/admin/MailSettingsForm.vue'
</script>

<!-- BGSI-297: "Avisos por correo" has its own page in "Gestión Administración" (before, it was in "Ajustes") -->
<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Avisos por correo</h1>
        <p>Elige a qué email llegan los mensajes del formulario de Contacto.</p>
      </div>
    </header>

    <!-- BGSI-261: who receives the "new contact" emails -->
    <MailSettingsForm />
  </section>
</template>
