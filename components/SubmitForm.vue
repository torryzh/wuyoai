<script setup lang="ts">
const { t } = useI18n()
const submitted = ref(false)

const form = reactive({
  name: '',
  url: '',
  category: '',
  description: '',
})

const categories = [
  { id: 'chat', name: 'AI对话聊天' },
  { id: 'writing', name: 'AI写作创作' },
  { id: 'image', name: 'AI绘画图像' },
  { id: 'video', name: 'AI视频生成' },
  { id: 'audio', name: 'AI音频音乐' },
  { id: 'code', name: 'AI编程开发' },
  { id: 'office', name: 'AI办公效率' },
  { id: 'search', name: 'AI搜索研究' },
  { id: 'education', name: 'AI教育学习' },
  { id: 'design', name: 'AI设计工具' },
  { id: 'tools', name: 'AI效率工具' },
  { id: 'research', name: 'AI前沿研究' },
]

const submit = () => {
  submitted.value = true
}
</script>

<template>
  <div class="submit-form-wrapper">
    <div v-if="submitted" class="submit-success card">
      <div class="success-icon">✅</div>
      <p>{{ t('submitSuccess') }}</p>
    </div>

    <form v-else class="submit-form" @submit.prevent="submit">
      <div class="form-group">
        <label>{{ t('toolName') }}</label>
        <input v-model="form.name" type="text" required>
      </div>

      <div class="form-group">
        <label>{{ t('toolUrl') }}</label>
        <input v-model="form.url" type="url" required>
      </div>

      <div class="form-group">
        <label>{{ t('toolCategory') }}</label>
        <select v-model="form.category" required>
          <option value="" disabled>{{ t('toolCategory') }}</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>{{ t('toolDesc') }}</label>
        <textarea v-model="form.description" rows="4" required />
      </div>

      <button type="submit" class="btn-primary submit-btn">
        {{ t('submitBtn') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.submit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 560px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}
.form-group input,
.form-group select,
.form-group textarea {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: var(--font-family);
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--accent-start);
}
.form-group textarea {
  resize: vertical;
}
.submit-btn {
  align-self: flex-start;
  padding: 0.75rem 2rem;
}
.submit-success {
  padding: 2rem;
  text-align: center;
}
.success-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.submit-success p {
  font-size: 1.1rem;
  color: var(--text-primary);
}
</style>
