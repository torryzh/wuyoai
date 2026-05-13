# Phase 1 实施方案：wuyoai.com AI 导航站（Nuxt 3 + 本地 JSON）

> 目标：2 周内上线一个完整的 AI 工具导航站
> 技术栈：Nuxt 3 + Vue 3 + UnoCSS + Nuxt i18n
> 预算：¥0（全免费方案）

---

## 📋 实施清单总览

```
Day 1-2   ▸ 环境准备 + Nuxt 3 项目初始化 + i18n 配置
Day 3-5   ▸ 核心页面开发（首页/分类页/详情页）
Day 6-8   ▸ AI 工具数据填充（155+ 工具，双语）
Day 9-10  ▸ SEO 优化 + 性能优化 + 明暗模式切换
Day 11-12 ▸ 部署上线 + 域名绑定
Day 13-14 ▸ 搜索引擎收录 + 初始推广
```

---

## 1️⃣ 技术选型（基于 Nuxt 3）

| 项目 | 选择 | 理由 |
|------|------|------|
| **框架** | Nuxt 3 | Vue 生态，熟悉，支持 SSG/SSR 渐进演进 |
| **UI** | UnoCSS | 轻量级原子 CSS，零配置，Vue 生态友好 |
| **主题** | 暗色模式优先 + 切换开关 | 用户偏好，科技感强 |
| **国际化** | @nuxtjs/i18n | 官方模块，成熟稳定，支持手动双语 |
| **搜索** | FlexSearch（客户端） | 零后端依赖，离线搜索 |
| **数据** | 本地 JSON 文件（双语结构） | 开发简单，SSG 友好 |
| **部署** | Vercel（免费） + Cloudflare CDN | 原生支持 Nuxt，零成本国内提速 |
| **SEO** | Nuxt 内置 | `useHead`/`useSeoMeta` 开箱即用 |
| **统计** | Google Analytics 4 + 百度统计 | 双引擎覆盖 |

---

## 2️⃣ UI 设计规范

### 2.1 配色方案
- **主色调**：蓝紫色渐变 `#6366F1 → #8B5CF6`（科技感，不刺眼）
- **背景色**：深灰底色 `#1a1a2e` + 轻微渐变（暗色模式优先）
- **卡片风格**：圆角 + 轻微悬浮阴影 + 鼠标悬停上浮效果
- **字体**：Inter（无衬线，中英文友好）

### 2.2 布局结构
```
┌─────────────────────────────────────────┐
│  Logo + 搜索栏 + 语言切换 + 主题切换    │  ← AppHeader
├──────────┬──────────────────────────────┤
│          │  Hero Banner                 │
│  分类栏  ├──────────────────────────────┤
│          │  🔥 精选推荐                  │
│          ├──────────────────────────────┤
│          │  工具卡片网格                 │
└──────────┴──────────────────────────────┘
│  Footer（关于/链接）                    │
└─────────────────────────────────────────┘
```

### 2.3 参考风格
- Futurepedia（全球最大 AI 导航站）
- 简约、专业、科技感

### 2.4 Logo 方案
- **开发期**：文字 Logo "无忧AI" + "wuyoAI"（CSS 实现）
- **正式版**：用户用 AI 生成后替换，建议提示词：极简科技感Logo，字母W和AI融合，蓝紫色渐变，矢量风格，白色背景

---

## 3️⃣ 分类体系（12 个分类）

| ID | 中文名称 | 图标 | 说明 |
|----|----------|------|------|
| chat | AI对话聊天 | 🤖 | ChatGPT、Claude、文心一言等通用大模型 |
| writing | AI写作创作 | ✍️ | 写文章、写文案、小说写作 |
| image | AI绘画图像 | 🎨 | Midjourney、DALL-E、图像生成 |
| video | AI视频生成 | 🎬 | 文字生成视频、视频剪辑、数字人 |
| audio | AI音频音乐 | 🎵 | 语音合成、音乐生成、AI配音 |
| code | AI编程开发 | 💻 | GitHub Copilot、代码生成、Debug工具 |
| office | AI办公效率 | 📊 | PPT生成、Excel公式、文档总结 |
| search | AI搜索研究 | 🔍 | AI搜索引擎、学术研究、文献总结 |
| education | AI教育学习 | 🎓 | 语言学习、AI老师、作业辅导 |
| design | AI设计工具 | 👔 | UI设计、LOGO设计、平面设计 |
| tools | AI效率工具 | 🧰 | 翻译、OCR、PDF处理、数据整理 |
| research | AI前沿研究 | 🔬 | 论文、开源模型、技术动态 |

---

## 4️⃣ 项目结构（Nuxt 3 规范）

```
wuyoai/
├── app.vue                  # 根组件
├── nuxt.config.ts           # Nuxt 配置（含 i18n）
├── package.json
├── tsconfig.json
├── i18n.config.ts           # 国际化配置
├── locales/
│   ├── zh.json              # 中文 UI 文本
│   └── en.json              # 英文 UI 文本
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── og-image.png
├── assets/
│   └── css/
│       └── main.css         # UnoCSS 入口 + 主题变量
├── pages/
│   ├── index.vue            # 首页
│   ├── categories/
│   │   └── [category].vue   # 分类页（动态路由）
│   ├── tools/
│   │   └── [slug].vue       # 工具详情页
│   ├── submit.vue           # 提交收录页
│   ├── about.vue            # 关于我们
│   └── 404.vue              # 404 页面
├── components/
│   ├── AppHeader.vue        # 顶部导航（含语言切换、主题切换）
│   ├── AppFooter.vue        # 底部信息
│   ├── SearchBar.vue        # 搜索框
│   ├── ToolCard.vue         # 工具卡片
│   ├── CategoryNav.vue      # 分类侧边栏
│   ├── HeroBanner.vue       # 首页 Banner
│   ├── ThemeToggle.vue      # 明暗模式切换
│   ├── LangToggle.vue       # 语言切换
│   └── SubmitForm.vue       # 提交表单
├── composables/
│   ├── useTools.ts          # 工具数据获取
│   ├── useSearch.ts         # 搜索逻辑
│   └── useTheme.ts          # 主题管理
├── data/
│   ├── tools.json           # 工具数据库（双语，核心）
│   └── categories.json      # 分类定义（双语）
└── server/
    └── api/
        └── tools.get.ts     # 预留 API 层（Phase 2 用）
```

---

## 5️⃣ 关键实现说明

### 5.1 国际化实现（中英文切换）

**原则：所有内容手动写双语，禁用实时机器翻译**

**i18n.config.ts 配置（从 locales JSON 文件加载，更利于维护大量翻译）**
```ts
export default defineI18nConfig(async () => ({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh: await import('./locales/zh.json').then(m => m.default),
    en: await import('./locales/en.json').then(m => m.default)
  }
}))
```

**locales/zh.json**
```json
{
  "home": "首页",
  "search": "搜索AI工具...",
  "categories": "分类",
  "submit": "提交收录",
  "featured": "精选推荐"
}
```

**locales/en.json**
```json
{
  "home": "Home",
  "search": "Search AI tools...",
  "categories": "Categories",
  "submit": "Submit",
  "featured": "Featured Tools"
}
```

**nuxt.config.ts 添加 i18n 模块**
```ts
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxtjs/i18n',       // 新增
    '@nuxtjs/sitemap'
  ],
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    strategy: 'prefix',   // URL: /zh/xxx, /en/xxx
    vueI18n: './i18n.config.ts'
  }
})
```

### 5.2 数据层实现（双语结构）

**data/tools.json**（工具数据库，双语）
```json
[
  {
    "id": "chatgpt",
    "name": {
      "zh": "ChatGPT",
      "en": "ChatGPT"
    },
    "url": "https://chat.openai.com",
    "logo": "/logos/chatgpt.png",
    "description": {
      "zh": "OpenAI 旗下最流行的 AI 对话工具，支持多模态输入输出",
      "en": "The most popular AI chat tool by OpenAI, supporting multimodal input/output"
    },
    "categories": ["chat", "writing", "code"],
    "tags": {
      "zh": ["免费", "GPT-4", "多模态"],
      "en": ["Free", "GPT-4", "Multimodal"]
    },
    "featured": true
  }
  // ... 155+ 工具
]
```

**composables/useTools.ts**（数据获取，支持当前语言）
```ts
import { computed } from 'vue'
import toolsData from '~/data/tools.json'
import { useI18n } from 'vue-i18n'

export const useTools = () => {
  const { locale } = useI18n()
  
  // 根据当前语言返回对应内容
  const tools = computed(() => {
    return toolsData.map(tool => ({
      ...tool,
      name: tool.name[locale.value],
      description: tool.description[locale.value],
      tags: tool.tags[locale.value]
    }))
  })

  return { data: tools }
}
```

### 5.3 主题切换实现（明暗模式）

**assets/css/main.css**（主题变量）
```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --accent-start: #6366f1;
  --accent-end: #8b5cf6;
}

.light-mode {
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --text-primary: #1a202c;
  --text-secondary: #718096;
}
```

**composables/useTheme.ts**（主题管理）
```ts
export const useTheme = () => {
  const isDark = useState('theme', () => true)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    // 仅在客户端操作 DOM，避免 SSR 报错
    if (import.meta.client) {
      document.documentElement.classList.toggle('light-mode', !isDark.value)
    }
  }

  return { isDark, toggleTheme }
}
```

### 5.4 首页核心代码

**pages/index.vue**
```vue
<script setup>
const { data: tools } = useTools() // useTools 是同步函数，不需要 await
const { t } = useI18n()

// 分类数据（从 categories.json 读取）
const { data: categories } = await useAsyncData('categories', () => 
  import('~/data/categories.json').then(m => m.default)
)

const featuredTools = computed(() => 
  tools.value?.filter(tool => tool.featured) || []
)
</script>

<template>
  <div>
    <!-- 顶部导航（含语言切换、主题切换） -->
    <AppHeader />

    <!-- Hero Banner -->
    <HeroBanner />

    <!-- 精选推荐 -->
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">{{ t('featured') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ToolCard 
          v-for="tool in featuredTools"
          :key="tool.id"
          :tool="tool"
        />
      </div>
    </div>

    <!-- 分类导航 -->
    <CategoryNav :categories="categories" />

    <!-- 底部 -->
    <AppFooter />
  </div>
</template>
```

---

## 6️⃣ 项目初始化步骤

```bash
# 1. 创建 Nuxt 3 项目
npx nuxi init wuyoai

# 2. 进入项目目录
cd wuyoai

# 3. 安装依赖
npm install

# 4. 添加依赖包
npm install -D @unocss/nuxt @nuxtjs/i18n @nuxtjs/sitemap
npm install flexsearch

# 5. 创建 Nuxt 配置
npx nuxi prepare

# 6. 目录结构初始化
mkdir -p data public/logos server/api locales assets/css components composables
```

**nuxt.config.ts 完整配置**
```ts
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    strategy: 'prefix',
    redirectOn: 'root', // 访问根路径 / 时自动重定向到 /zh/
    vueI18n: './i18n.config.ts'
  },
  nitro: {
    prerender: {
      routes: ['/zh/', '/en/', '/zh/about', '/en/about', '/zh/submit', '/en/submit'],
      crawlLinks: true
    }
  },
  app: {
    head: {
      title: '无忧AI - 发现最好用的 AI 工具',
      meta: [
        { name: 'description', content: '中文 AI 工具导航站，收录 150+ AI 写作、绘图、编程等工具' }
      ]
    }
  }
})
```

---

## 7️⃣ 本地开发与构建

```bash
# 开发模式（热重载）
npm run dev

# 生成静态站点（SSG，双语页面）
npm run generate

# 查看预览
npm run preview
```

**SSG 输出**：
- 生成 `dist/` 目录，包含完整 HTML
- 每个页面都有 zh 和 en 两个版本
- 零服务器依赖

---

## 8️⃣ 部署方案与速度优化

### Vercel 部署（免费）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd wuyoai
vercel --prod

# 4. 绑定域名
vercel domains add wuyoai.com
```

### DNS 配置（直接解析到 Vercel）
```
Type   Name   Value
A      @      76.76.21.21        (Vercel IP)
CNAME  www    cname.vercel-dns.com
```

**国内访问速度**：2-5 秒（静态站点，完全可用）

### Cloudflare CDN 提速（免费，可选）

上线后如果觉得速度慢，可升级：
1. 域名 DNS 改成 Cloudflare 的 Nameserver
2. Cloudflare 回源到 Vercel
3. 开启 Cloudflare "中国加速"

**效果**：国内访问速度提升到 1-3 秒，还是免费，不需要备案

---

## 9️⃣ 首批工具数据

**已整理完成**：`tools-draft.md`，共 155 个工具，覆盖 85% 主流 AI 工具

**整理原则**：
- ❌ 不从其他导航站爬取，独立整理
- ✅ 优先级：国外知名工具 → 国内大厂产品 → 小众好用工具
- ✅ 每个分类 10-15 个工具
- ✅ 所有工具描述手动写双语

---

## 🔟 渐进式演进路径

### Phase 1（现在）
- ✅ 用 `data/tools.json` + SSG
- ✅ 静态 HTML，零服务器依赖
- ✅ 支持中英文切换
- ✅ 支持明暗主题切换

### Phase 2（2-3 月后）
```ts
// server/api/tools.get.ts
export default defineEventHandler(() => {
  return await $fetch('/data/tools.json')
})
```
- 保留本地 JSON
- 通过 API 层读取
- 为切换数据库做准备

### Phase 3（4-6 月后）
```ts
// server/api/tools.get.ts
import { db } from '#db'

export default defineEventHandler(() => {
  return db.select().from(tools)
})
```
- 切换到 Supabase/PostgreSQL
- 组件代码零改动

---

## 1️⃣1️⃣ 上线后运营

### 第一周
- [ ] 提交到 Google Search Console
- [ ] 提交到百度搜索资源平台
- [ ] 在 V2EX/知乎分享

### 第二周起
- [ ] 开放 "提交收录" 表单（自动写入 data/tools.json）
- [ ] 监控流量来源
- [ ] 接入 1-2 个 Affiliate 链接

---

## 📊 里程碑验收标准

| 里程碑 | 验收标准 |
|--------|----------|
| M1 - 站点可访问 | 首页、分类页、详情页均可正常浏览 |
| M2 - 数据完整 | 收录 155+ AI 工具，12 个分类，双语内容齐全 |
| M3 - 功能完整 | 搜索可用 + 中英文切换 + 明暗模式切换 |
| M4 - SEO 就绪 | Google/百度已提交 sitemap，双语页面均收录 |
| M5 - 上线部署 | wuyoai.com 可通过域名正常访问 |

---

*v2.0 更新内容：国际化方案 + 暗色主题 + 12个分类确认 + 部署优化 + Logo方案 | 2026-05-12*
