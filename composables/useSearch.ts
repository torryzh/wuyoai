import { ref, computed } from 'vue'

export const useSearch = () => {
  const query = ref('')
  const isOpen = ref(false)
  const { searchTools } = useTools()

  const results = computed(() => {
    if (!query.value.trim()) return []
    return searchTools(query.value).value.slice(0, 20)
  })

  const open = () => { isOpen.value = true }
  const close = () => {
    isOpen.value = false
    query.value = ''
  }

  return { query, isOpen, results, open, close }
}
