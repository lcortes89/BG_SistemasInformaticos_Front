<script setup>
import logoFooter from '@/assets/logo/logo_footer.png'
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__column footer__column--brand">
        <img :src="logoFooter" alt="BG Sistemas Informáticos" class="footer__logo" />
        <div class="footer__social">
          <a href="https://www.linkedin.com/in/javi-guty-8112ab399/" target="_blank" rel="noopener" class="footer__social-link">LinkedIn</a>
          <a href="https://www.instagram.com/guty.ribadeo" target="_blank" rel="noopener" class="footer__social-link">Instagram</a>
          <a href="https://www.facebook.com/share/1FiV6BGZQx/" target="_blank" rel="noopener" class="footer__social-link">Facebook</a>
        </div>
      </div>

      <div class="footer__column">
        <h3 class="footer__heading">Navegación</h3>
        <nav class="footer__nav">
          <RouterLink to="/soluciones" class="footer__nav-link">Soluciones</RouterLink>
          <RouterLink to="/tarifas" class="footer__nav-link">Tarifas</RouterLink>
          <RouterLink to="/clientes" class="footer__nav-link">Nuestros Clientes</RouterLink>
        </nav>
      </div>

      <div class="footer__column">
        <h3 class="footer__heading">Contacto</h3>
        <p class="footer__contact-item">servicios@consultoriass.es</p>
        <p class="footer__contact-item">+34 615 471 066</p>
      </div>

      <div class="footer__column">
        <h3 class="footer__heading">Legal</h3>
        <nav class="footer__nav">
          <RouterLink to="/privacidad" class="footer__nav-link">Política de Privacidad</RouterLink>
          <RouterLink to="/terminos" class="footer__nav-link">Términos y Condiciones</RouterLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-navy, #1a2b4c);
  color: #ffffff;
  padding: 3rem 2rem;
}

.footer__container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer__column {
  flex: 1;
  min-width: 180px;
}

.footer__logo {
  height: 56px;
  margin-bottom: 1rem;
}

.footer__social {
  display: flex;
  gap: 1rem;
}

.footer__social-link {
  color: #ffffff;
  text-decoration: none;
}

.footer__social-link:hover {
  color: var(--color-orange, #e8792a);
}

.footer__heading {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--color-orange, #e8792a);
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__nav-link {
  color: #ffffff;
  text-decoration: none;
}

.footer__nav-link:hover {
  color: var(--color-orange, #e8792a);
}

.footer__contact-item {
  margin: 0 0 0.5rem 0;
}
</style>