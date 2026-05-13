<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">W</span>
            <span class="logo-text">无忧<span class="gradient-text">AI</span></span>
          </div>
          <p class="footer-desc">{{ t('aboutDesc') }}</p>
        </div>

        <div class="footer-section">
          <h4>{{ t('footerLinks') }}</h4>
          <nav>
            <NuxtLink :to="localePath('/')">{{ t('home') }}</NuxtLink>
            <NuxtLink :to="localePath('/submit')">{{ t('submit') }}</NuxtLink>
            <NuxtLink :to="localePath('/about')">{{ t('about') }}</NuxtLink>
          </nav>
        </div>

        <div class="footer-section">
          <h4>{{ t('footerContact') }}</h4>
          <p>contact@wuyoai.com</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>{{ t('copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}
.logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}
.footer-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.footer-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}
.footer-section nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.footer-section a,
.footer-section p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-section a:hover {
  color: var(--accent-start);
}
.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
