<script setup>
const { t } = useI18n()

useHead({
  title: () => t('about'),
})
</script>

<template>
  <div class="about-page container">
    <h1>{{ t('about') }}</h1>
    <div class="about-content card">
      <p>{{ t('aboutDesc') }}</p>
      <div class="about-stats">
        <div class="stat">
          <span class="stat-number">155+</span>
          <span class="stat-label">AI Tools</span>
        </div>
        <div class="stat">
          <span class="stat-number">12</span>
          <span class="stat-label">{{ t('categories') }}</span>
        </div>
        <div class="stat">
          <span class="stat-number">2</span>
          <span class="stat-label">Languages</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 0;
  max-width: 720px;
}
.about-page h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.about-content {
  padding: 2rem;
}
.about-content p {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}
.about-stats {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}
.stat {
  text-align: center;
}
.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
