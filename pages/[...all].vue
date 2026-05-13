<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="error-page container">
    <h1>404</h1>
    <p>{{ t('noResults') }}</p>
    <NuxtLink :to="localePath('/')" class="btn-primary">
      {{ t('home') }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  padding: 6rem 0;
}
.error-page h1 {
  font-size: 5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.error-page p {
  color: var(--text-secondary);
  margin: 1rem 0 2rem;
  font-size: 1.1rem;
}
.error-page .btn-primary {
  text-decoration: none;
}
</style>
