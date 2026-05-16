<script setup lang="ts">
const { t, locale } = useI18n()
const { getFeaturedTools, data: tools } = useTools()
const localePath = useLocalePath()

useHead({
  title: '无忧AI - 发现最好用的 AI 工具',
  meta: [
    { name: 'description', content: '中文 AI 工具导航站，收录 150+ AI 写作、绘图、编程等工具，帮你发现最好用的 AI 工具' },
    { property: 'og:title', content: '无忧AI - 发现最好用的 AI 工具' },
    { property: 'og:description', content: '收录 150+ 精选 AI 工具，覆盖对话、写作、绘画、编程等 12 大类别' },
  ],
})

const featuredTools = getFeaturedTools()

const { data: categories } = await useAsyncData('categories', () =>
  import('~/data/categories.json').then(m => m.default),
)

const localizedCategories = computed(() => {
  if (!categories.value) return []
  return categories.value.map(cat => ({
    ...cat,
    name: cat.name[locale.value as keyof typeof cat.name] || cat.name.zh,
  }))
})
</script>

<template>
  <div>
    <HeroBanner />

    <section class="container section">
      <h2 class="section-title">{{ t('featured') }}</h2>
      <div class="tools-grid">
        <ToolCard
          v-for="tool in featuredTools"
          :key="tool.id"
          :tool="tool"
        />
      </div>
    </section>

    <section class="container section">
      <h2 class="section-title">{{ t('categories') }}</h2>
      <CategoryNav :categories="localizedCategories" />

      <div v-for="cat in localizedCategories" :key="cat.id" class="category-section">
        <div class="category-header">
          <span class="category-icon">{{ cat.icon }}</span>
          <h3>{{ cat.name }}</h3>
          <NuxtLink :to="localePath(`/categories/${cat.id}`)" class="view-all">
            {{ t('allTools') }} →
          </NuxtLink>
        </div>
        <div class="tools-grid">
          <ToolCard
            v-for="tool in tools.filter(t => t.categories.includes(cat.id)).slice(0, 4)"
            :key="tool.id"
            :tool="tool"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 2rem 0;
}
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.category-section {
  margin-top: 2.5rem;
}
.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.category-header .category-icon {
  font-size: 1.25rem;
}
.category-header h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}
.view-all {
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--accent-start);
  text-decoration: none;
  transition: opacity 0.2s;
}
.view-all:hover {
  opacity: 0.8;
}
</style>
