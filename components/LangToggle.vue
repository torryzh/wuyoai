<script setup>
const { locale, setLocale } = useI18n()

const toggle = () => {
  setLocale(locale.value === 'zh' ? 'en' : 'zh')
}
</script>

<template>
  <button class="lang-toggle" @click="toggle">
    {{ locale === 'zh' ? 'EN' : '中文' }}
  </button>
</template>

<style scoped>
.lang-toggle {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;
}
.lang-toggle:hover {
  background: var(--border-color);
}
</style>
