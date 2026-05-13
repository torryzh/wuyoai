<script setup>
const { t } = useI18n()
</script>

<template>
  <section class="hero">
    <div class="hero-inner container">
      <h1 class="hero-title">
        {{ t('tagline') }}
      </h1>
      <p class="hero-subtitle">
        {{ t('subtitle') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 4rem 0 3rem;
  text-align: center;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}
.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}
.hero-title {
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero {
    padding: 2.5rem 0 2rem;
  }
  .hero-title {
    font-size: 1.75rem;
  }
  .hero-subtitle {
    font-size: 0.95rem;
  }
}
</style>
