import { computed } from 'vue'
import toolsData from '~/data/tools.json'
import { useI18n } from 'vue-i18n'

export const useTools = () => {
  const { locale } = useI18n()

  const tools = computed(() => {
    return toolsData.map(tool => ({
      ...tool,
      name: tool.name[locale.value as keyof typeof tool.name] || tool.name.zh,
      description: tool.description[locale.value as keyof typeof tool.description] || tool.description.zh,
      tags: tool.tags[locale.value as keyof typeof tool.tags] || tool.tags.zh,
    }))
  })

  const getToolsByCategory = (categoryId: string) => {
    return computed(() => tools.value.filter(tool => tool.categories.includes(categoryId)))
  }

  const getToolBySlug = (slug: string) => {
    return computed(() => tools.value.find(tool => tool.id === slug))
  }

  const getFeaturedTools = () => {
    return computed(() => tools.value.filter(tool => tool.featured))
  }

  const searchTools = (query: string) => {
    const q = query.toLowerCase().trim()
    if (!q) return tools
    return computed(() =>
      tools.value.filter(tool =>
        tool.name.toLowerCase().includes(q)
        || tool.description.toLowerCase().includes(q)
        || tool.tags.some((tag: string) => tag.toLowerCase().includes(q)),
      ),
    )
  }

  return { data: tools, getToolsByCategory, getToolBySlug, getFeaturedTools, searchTools }
}
