<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  tool: {
    id: string
    name: string
    url: string
    description: string
    tags: string[]
    featured?: boolean
  }
}>()
</script>

<template>
  <NuxtLink :to="localePath(`/tools/${tool.id}`)" class="tool-card card">
    <div class="card-header">
      <div class="tool-icon">
        {{ tool.name.charAt(0).toUpperCase() }}
      </div>
      <div class="tool-info">
        <h3 class="tool-name">{{ tool.name }}</h3>
        <a
          :href="tool.url"
          target="_blank"
          rel="noopener"
          class="tool-url"
          @click.stop
        >
          {{ tool.url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}
        </a>
      </div>
    </div>
    <p class="tool-desc">{{ tool.description }}</p>
    <div class="tool-tags">
      <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  text-decoration: none;
  cursor: pointer;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.tool-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.tool-info {
  overflow: hidden;
}
.tool-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tool-url {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
}
.tool-url:hover {
  color: var(--accent-start);
}
.tool-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
