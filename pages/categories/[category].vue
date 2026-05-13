<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const { getToolsByCategory } = useTools()
const localePath = useLocalePath()

const categoryId = route.params.category as string

const { data: categories } = await useAsyncData('categories', () =>
  import('~/data/categories.json').then(m => m.default),
)

const currentCategory = computed(() => {
  if (!categories.value) return null
  const cat = categories.value.find(c => c.id === categoryId)
  if (!cat) return null
  return {
    ...cat,
    name: cat.name[locale.value as keyof typeof cat.name] || cat.name.zh,
    description: cat.description[locale.value as keyof typeof cat.description] || cat.description.zh,
  }
})

const categoryTools = getToolsByCategory(categoryId)

const localizedCategories = computed(() => {
  if (!categories.value) return []
  return categories.value.map(cat => ({
    ...cat,
    name: cat.name[locale.value as keyof typeof cat.name] || cat.name.zh,
  }))
})

useHead({
  title: () => currentCategory.value?.name || '分类',
})
</script>

<template>
  <div class="category-page container">
    <div class="page-header">
      <NuxtLink :to="localePath('/')" class="back-link">← {{ t('back') }}</NuxtLink>
      <div v-if="currentCategory" class="category-info">
        <h1>
          <span class="category-icon">{{ currentCategory.icon }}</span>
          {{ currentCategory.name }}
        </h1>
        <p class="category-desc">{{ currentCategory.description }}</p>
      </div>
    </div>

    <CategoryNav :categories="localizedCategories" :active-category="categoryId" />

    <div class="tools-grid">
      <ToolCard
        v-for="tool in categoryTools"
        :key="tool.id"
        :tool="tool"
      />
    </div>

    <div v-if="categoryTools.length === 0" class="empty">
      {{ t('noResults') }}
    </div>
  </div>
</template>

<style scoped>
.category-page {
  padding: 2rem 0;
}
.page-header {
  margin-bottom: 1.5rem;
}
.back-link {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover {
  color: var(--accent-start);
}
.category-info {
  margin-top: 1rem;
}
.category-info h1 {
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.category-icon {
  font-size: 1.5rem;
}
.category-desc {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
.empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}
</style>
