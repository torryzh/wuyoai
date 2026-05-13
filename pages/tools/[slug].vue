<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { getToolBySlug } = useTools()
const localePath = useLocalePath()

const slug = route.params.slug as string
const tool = getToolBySlug(slug)

useHead({
  title: () => tool.value?.name || '工具详情',
})
</script>

<template>
  <div class="tool-detail container">
    <NuxtLink :to="localePath('/')" class="back-link">← {{ t('back') }}</NuxtLink>

    <div v-if="tool" class="tool-content card">
      <div class="tool-header">
        <div class="tool-icon-large">
          {{ tool.name.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="tool-name">{{ tool.name }}</h1>
          <a :href="tool.url" target="_blank" rel="noopener" class="tool-url">
            {{ tool.url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}
          </a>
        </div>
        <a :href="tool.url" target="_blank" rel="noopener" class="btn-primary visit-btn">
          {{ t('visitSite') }}
        </a>
      </div>

      <p class="tool-description">{{ tool.description }}</p>

      <div class="tool-tags">
        <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
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
.tool-content {
  padding: 2rem;
}
.tool-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
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
.tool-name {
  font-size: 1.5rem;
  font-weight: 700;
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
}
.tool-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
</style>
