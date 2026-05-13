<script setup lang="ts">
const { t } = useI18n()
const { query, isOpen, results, open, close } = useSearch()
const router = useRouter()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

const goToTool = (id: string) => {
  close()
  router.push(`/tools/${id}`)
}

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      open()
    }
  })
})
</script>

<template>
  <div class="search-wrapper">
    <button class="search-trigger" @click="open">
      <span class="search-icon">🔍</span>
      <span class="search-placeholder">{{ t('search') }}</span>
      <span class="search-shortcut">⌘K</span>
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="search-overlay" @click.self="close">
        <div class="search-modal">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              v-model="query"
              :placeholder="t('search')"
              class="search-input"
              autofocus
              @keydown="onKeydown"
            >
            <button class="search-close" @click="close">✕</button>
          </div>
          <div v-if="results.length" class="search-results">
            <button
              v-for="tool in results"
              :key="tool.id"
              class="search-result-item"
              @click="goToTool(tool.id)"
            >
              <div class="result-name">{{ tool.name }}</div>
              <div class="result-desc">{{ tool.description }}</div>
            </button>
          </div>
          <div v-else-if="query.trim()" class="search-empty">
            {{ t('noResults') }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.search-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  min-width: 240px;
  transition: border-color 0.2s;
}
.search-trigger:hover {
  border-color: var(--accent-start);
}
.search-placeholder {
  flex: 1;
  text-align: left;
  font-size: 0.875rem;
}
.search-shortcut {
  font-size: 0.75rem;
  opacity: 0.5;
  border: 1px solid var(--border-color);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}
.search-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 90%;
  max-width: 560px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
}
.search-input::placeholder {
  color: var(--text-secondary);
}
.search-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}
.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}
.search-result-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.search-result-item:hover {
  background: var(--bg-secondary);
}
.result-name {
  font-weight: 600;
  font-size: 0.95rem;
}
.result-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
}
</style>
