<script setup lang="ts">
defineProps<{
  categories: Array<{
    id: string
    icon: string
    name: string
  }>
  activeCategory?: string
}>()

const localePath = useLocalePath()
</script>

<template>
  <nav class="category-nav">
    <NuxtLink
      v-for="cat in categories"
      :key="cat.id"
      :to="localePath(`/categories/${cat.id}`)"
      class="category-item"
      :class="{ active: activeCategory === cat.id }"
    >
      <span class="category-icon">{{ cat.icon }}</span>
      <span class="category-name">{{ cat.name }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 0;
}
.category-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}
.category-item:hover,
.category-item.active {
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  color: #fff;
  border-color: transparent;
}
.category-icon {
  font-size: 1rem;
}
</style>
