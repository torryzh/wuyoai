<script setup>
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggleTheme"
  >
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}
.theme-toggle:hover {
  background: var(--border-color);
}
</style>
