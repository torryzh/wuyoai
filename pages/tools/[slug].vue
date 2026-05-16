<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const { getToolBySlug, data: tools } = useTools()
const localePath = useLocalePath()

const slug = route.params.slug as string
const tool = getToolBySlug(slug)

useHead({
  title: () => tool.value?.name || t('noResults'),
})

const relatedTools = computed(() => {
  if (!tool.value) return []
  return tools.value
    .filter(item => item.id !== tool.value!.id && item.categories.some(c => tool.value!.categories.includes(c)))
    .slice(0, 6)
})

const difficultyStars = computed(() => {
  if (!tool.value?.difficulty) return 0
  const map: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
  return map[tool.value.difficulty] || 0
})

const difficultyLabel = computed(() => {
  if (!tool.value?.difficulty) return ''
  const map: Record<string, string> = { easy: 'difficultyEasy', medium: 'difficultyMedium', hard: 'difficultyHard' }
  return t(map[tool.value.difficulty] || '')
})
</script>

<template>
  <div class="tool-detail container">
    <NuxtLink :to="localePath('/')" class="back-link">← {{ t('back') }}</NuxtLink>

    <div v-if="tool" class="tool-content">
      <!-- Header -->
      <div class="tool-header card">
        <div class="tool-icon-large">
          {{ tool.name.charAt(0).toUpperCase() }}
        </div>
        <div class="tool-meta">
          <h1 class="tool-name">{{ tool.name }}</h1>
          <a :href="tool.url" target="_blank" rel="noopener" class="tool-url">
            {{ tool.url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}
          </a>
        </div>
        <a :href="tool.url" target="_blank" rel="noopener" class="btn-primary visit-btn">
          {{ t('visitSite') }}
        </a>
      </div>

      <!-- Description -->
      <section class="section card">
        <p class="tool-description">{{ tool.detailedDescription }}</p>
      </section>

      <div class="detail-grid">
        <!-- Features -->
        <section v-if="tool.features?.length" class="section card">
          <h2 class="section-title">{{ t('features') }}</h2>
          <ul class="features-list">
            <li v-for="(feature, i) in tool.features" :key="i" class="feature-item">
              <span class="feature-icon">✓</span>
              <div>
                <strong>{{ feature.name }}</strong>
                <p v-if="feature.desc" class="feature-desc">{{ feature.desc }}</p>
              </div>
            </li>
          </ul>
        </section>

        <!-- Pricing -->
        <section v-if="tool.pricing" class="section card">
          <h2 class="section-title">{{ t('pricing') }}</h2>
          <div v-if="tool.pricing.free" class="pricing-free">
            <span class="pricing-label">{{ t('freeVersion') }}:</span>
            {{ tool.pricing.free }}
          </div>
          <div v-if="tool.pricing.plans?.length" class="pricing-plans">
            <div v-for="plan in tool.pricing.plans" :key="plan.name" class="pricing-plan">
              <div class="plan-header">
                <span class="plan-name">{{ plan.name }}</span>
                <span class="plan-price">{{ plan.price }}</span>
              </div>
              <ul v-if="plan.features?.length" class="plan-features">
                <li v-for="f in plan.features" :key="f">{{ f }}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- Pros & Cons -->
      <div v-if="tool.pros?.length || tool.cons?.length" class="detail-grid">
        <section v-if="tool.pros?.length" class="section card">
          <h2 class="section-title pros-title">✓ {{ t('pros') }}</h2>
          <ul class="pros-list">
            <li v-for="pro in tool.pros" :key="pro">{{ pro }}</li>
          </ul>
        </section>

        <section v-if="tool.cons?.length" class="section card">
          <h2 class="section-title cons-title">✗ {{ t('cons') }}</h2>
          <ul class="cons-list">
            <li v-for="con in tool.cons" :key="con">{{ con }}</li>
          </ul>
        </section>
      </div>

      <!-- Difficulty & Use Cases -->
      <div class="detail-grid">
        <section v-if="tool.difficulty" class="section card">
          <h2 class="section-title">{{ t('difficulty') }}</h2>
          <div class="difficulty">
            <span class="difficulty-stars">
              <span v-for="i in 3" :key="i" :class="{ active: i <= difficultyStars }">★</span>
            </span>
            <span class="difficulty-label">{{ difficultyLabel }}</span>
          </div>
          <p v-if="tool.difficultyNote" class="difficulty-note">{{ tool.difficultyNote }}</p>
        </section>

        <section v-if="tool.useCases?.length" class="section card">
          <h2 class="section-title">{{ t('useCases') }}</h2>
          <div class="use-cases">
            <span v-for="uc in tool.useCases" :key="uc" class="use-case-tag">{{ uc }}</span>
          </div>
        </section>
      </div>

      <!-- Tags -->
      <section class="section card">
        <div class="tool-tags">
          <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </section>

      <!-- Related Tools -->
      <section v-if="relatedTools.length" class="section">
        <h2 class="section-title">{{ t('relatedTools') }}</h2>
        <div class="tools-grid">
          <ToolCard
            v-for="related in relatedTools"
            :key="related.id"
            :tool="related"
          />
        </div>
      </section>
    </div>

    <div v-else class="not-found">
      <h2>404</h2>
      <p>{{ t('noResults') }}</p>
      <NuxtLink :to="localePath('/')" class="btn-primary">{{ t('home') }}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.tool-detail {
  padding: 2rem 0;
}
.back-link {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 1.5rem;
}
.back-link:hover {
  color: var(--accent-start);
}
.tool-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.tool-icon-large {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.75rem;
  flex-shrink: 0;
}
.tool-meta {
  flex: 1;
  min-width: 0;
}
.tool-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.tool-url {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-decoration: none;
}
.tool-url:hover {
  color: var(--accent-start);
}
.visit-btn {
  margin-left: auto;
  text-decoration: none;
  white-space: nowrap;
}
.section {
  margin-bottom: 1.5rem;
}
.section.card {
  padding: 1.5rem;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}
.tool-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.feature-icon {
  color: var(--accent-start);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.1rem;
}
.feature-desc {
  font-size: 0.85rem;
  margin-top: 0.2rem;
  opacity: 0.8;
}
.pricing-free {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
.pricing-label {
  font-weight: 600;
}
.pricing-plans {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.pricing-plan {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}
.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.plan-name {
  font-weight: 600;
}
.plan-price {
  color: var(--accent-start);
  font-weight: 600;
}
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.plan-features li::before {
  content: "•";
  margin-right: 0.5rem;
  color: var(--accent-start);
}
.pros-title {
  color: #22c55e;
}
.cons-title {
  color: #ef4444;
}
.pros-list, .cons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.pros-list li, .cons-list li {
  padding: 0.4rem 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}
.pros-list li::before {
  content: "✓";
  margin-right: 0.5rem;
  color: #22c55e;
  font-weight: 700;
}
.cons-list li::before {
  content: "✗";
  margin-right: 0.5rem;
  color: #ef4444;
  font-weight: 700;
}
.difficulty {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.difficulty-stars span {
  font-size: 1.25rem;
  color: var(--border-color);
}
.difficulty-stars span.active {
  color: #f59e0b;
}
.difficulty-label {
  font-weight: 600;
  font-size: 0.95rem;
}
.difficulty-note {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.use-cases {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.use-case-tag {
  padding: 0.4rem 0.8rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.not-found {
  text-align: center;
  padding: 4rem 0;
}
.not-found h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.not-found p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}
.not-found .btn-primary {
  text-decoration: none;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .tool-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .visit-btn {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
