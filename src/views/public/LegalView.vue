<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LegalText from '@/components/legal/LegalText.vue'
import { LEGAL_PAGES, LEGAL_UPDATED } from '@/core/config/legal-pages'

// BGSI-321: Aviso legal, Política de privacidad and Política de cookies. Same view, the text comes from the route
const route = useRoute()
const page = computed(() => LEGAL_PAGES[route.name])

const OTHER_PAGES = [
  { name: 'legal-notice', to: '/aviso-legal' },
  { name: 'privacy', to: '/privacidad' },
  { name: 'cookies', to: '/cookies' },
]
</script>

<template>
  <article v-if="page" class="legal">
    <div class="container legal__container">
      <header class="legal__header">
        <h1>{{ page.title }}</h1>
        <p class="legal__updated">Última actualización: {{ LEGAL_UPDATED }}</p>
        <p v-for="(paragraph, index) in page.intro" :key="index" class="legal__intro"><LegalText :parts="paragraph" /></p>
      </header>

      <div class="legal__layout">
        <nav class="legal__index" aria-label="Índice">
          <p class="legal__index-title">En esta página</p>
          <ol>
            <li v-for="section in page.sections" :key="section.id"><a :href="`#${section.id}`">{{ section.title }}</a></li>
          </ol>
          <p class="legal__index-title">Otros textos legales</p>
          <ul>
            <li v-for="other in OTHER_PAGES.filter((o) => o.name !== route.name)" :key="other.name">
              <RouterLink :to="other.to">{{ LEGAL_PAGES[other.name].title }}</RouterLink>
            </li>
          </ul>
        </nav>

        <div class="legal__body">
          <section v-for="section in page.sections" :id="section.id" :key="section.id" class="legal__section">
            <h2>{{ section.title }}</h2>
            <ul v-if="section.list" class="legal__list">
              <li v-for="(item, index) in section.list" :key="index"><LegalText :parts="item" /></li>
            </ul>
            <p v-for="(paragraph, index) in section.paragraphs ?? []" :key="index"><LegalText :parts="paragraph" /></p>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.legal {
  padding: 3rem 0 4rem;
  background: var(--color-bg-alt);

  &__header { max-width: 760px; margin-bottom: 2rem; }
  h1 { margin: 0 0 0.25rem; color: var(--color-navy); font-size: clamp(1.8rem, 4vw, 2.4rem); }
  &__updated { margin: 0 0 1rem; font-size: 0.9rem; color: var(--color-muted); }
  &__intro { margin: 0; font-size: 1.05rem; line-height: 1.6; }

  &__layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 2rem;
    align-items: start;
  }

  &__index {
    position: sticky;
    top: 6rem;
    padding: 1.25rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(11, 31, 58, 0.06);
    font-size: 0.92rem;

    ol, ul { margin: 0 0 1rem; padding-left: 1.1rem; line-height: 1.7; }
    ul:last-child { margin-bottom: 0; }
    a { color: var(--color-navy); }
  }

  &__index-title { margin: 0 0 0.4rem; font-weight: 700; color: var(--color-navy); }

  &__body {
    padding: 2rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(11, 31, 58, 0.06);
    line-height: 1.7;
  }

  &__section {
    scroll-margin-top: 6rem; // the index link does not hide the title under the header
    & + & { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eef0f3; }

    h2 { margin: 0 0 0.75rem; font-size: 1.2rem; color: var(--color-navy); }
    p { margin: 0 0 0.75rem; }
    p:last-child { margin-bottom: 0; }
    // The links are inside LegalText (another component), so :deep
    :deep(a) { color: var(--color-orange-dark); font-weight: 600; }
  }

  &__list { margin: 0 0 0.75rem; padding-left: 1.1rem; }
}

@media (max-width: 860px) {
  .legal__layout { grid-template-columns: 1fr; }
  .legal__index { position: static; }
  .legal__body { padding: 1.25rem; }
}
</style>
