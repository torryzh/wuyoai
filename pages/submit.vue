<script setup>
const { t } = useI18n()

useHead({
  title: () => t('submitTitle'),
})
</script>

<template>
  <div class="submit-page container">
    <div class="page-header">
      <h1>{{ t('submitTitle') }}</h1>
      <p class="page-desc">{{ t('submitDesc') }}</p>
    </div>
    <SubmitForm />
  </div>
</template>

<style scoped>
.submit-page {
  padding: 2rem 0;
  max-width: 640px;
}
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
}
.page-desc {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
</style>
