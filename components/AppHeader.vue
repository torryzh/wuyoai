<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="app-header">
    <div class="header-inner container">
      <NuxtLink :to="localePath('/')" class="logo">
        <img src="/Logo.png" alt="无忧AI" class="logo-img" />
      </NuxtLink>

      <nav class="header-nav">
        <NuxtLink :to="localePath('/')" class="nav-link">{{ t('home') }}</NuxtLink>
        <NuxtLink :to="localePath('/submit')" class="nav-link">{{ t('submit') }}</NuxtLink>
        <NuxtLink :to="localePath('/about')" class="nav-link">{{ t('about') }}</NuxtLink>
      </nav>

      <div class="header-actions">
        <SearchBar />
        <LangToggle />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 64px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}
.header-nav {
  display: flex;
  gap: 0.25rem;
  margin-left: 1rem;
}
.nav-link {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}
.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
  background: var(--border-color);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
  .header-actions :deep(.search-placeholder) {
    display: none;
  }
  .header-actions :deep(.search-shortcut) {
    display: none;
  }
  .header-actions :deep(.search-trigger) {
    min-width: auto;
    padding: 0.5rem;
  }
}
</style>
