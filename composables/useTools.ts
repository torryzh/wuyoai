import { computed } from 'vue'
import toolsData from '~/data/tools.json'
import { useI18n } from 'vue-i18n'

// 动态导入详情文件
const detailModules = import.meta.glob('~/data/tool-details/*.json', { eager: true })

// 构建详情数据映射
const toolDetails: Record<string, any> = {}
for (const [path, module] of Object.entries(detailModules)) {
  const id = path.split('/').pop()?.replace('.json', '') || ''
  toolDetails[id] = (module as any).default || module
}

export const useTools = () => {
  const { locale } = useI18n()

  const tools = computed(() => {
    return toolsData.map(tool => {
      const detail = toolDetails[tool.id] || {}

      return {
        ...tool,
        name: tool.name[locale.value as keyof typeof tool.name] || tool.name.zh,
        description: tool.description[locale.value as keyof typeof tool.description] || tool.description.zh,
        tags: tool.tags[locale.value as keyof typeof tool.tags] || tool.tags.zh,
        // 详情数据（优先使用详情文件，回退到基础数据）
        detailedDescription: detail.description || tool.description[locale.value as keyof typeof tool.description] || tool.description.zh,
        features: detail.features || [],
        pricing: detail.pricing || null,
        pros: detail.pros || [],
        cons: detail.cons || [],
        difficulty: detail.difficulty || null,
        difficultyNote: detail.difficultyNote || '',
        useCases: detail.useCases || [],
      }
    })
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
