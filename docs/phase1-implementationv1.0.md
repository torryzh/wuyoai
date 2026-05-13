# Phase 1 实施方案：wuyoai.com AI 导航站（Nuxt 3 + 本地 JSON）

> 目标：2 周内上线一个完整的 AI 工具导航站
> 技术栈：Nuxt 3 + Vue 3 + UnoCSS + Nuxt Content
> 预算：¥0（全免费方案）

---

## 📋 实施清单总览

```
Day 1-2   ▸ 环境准备 + Nuxt 3 项目初始化
Day 3-5   ▸ 核心页面开发（首页/分类页/详情页）
Day 6-8   ▸ AI 工具数据填充（200+ 工具）
Day 9-10  ▸ SEO 优化 + 性能优化
Day 11-12 ▸ 部署上线 + 域名绑定
Day 13-14 ▸ 搜索引擎收录 + 初始推广
```

---

## 1️⃣ 技术选型（基于 Nuxt 3）

| 项目 | 选择 | 理由 |
|------|------|------|
| **框架** | Nuxt 3 | Vue 生态，你熟悉，支持 SSG/SSR 渐进演进 |
| **UI** | UnoCSS | 轻量级原子 CSS，零配置，Vue 生态友好 |
| **搜索** | FlexSearch（客户端） | 零后端依赖，离线搜索 |
| **数据** | 本地 JSON 文件 | 开发简单，SSG 友好 |
| **部署** | Vercel（免费） | 原生支持 Nuxt |
| **SEO** | Nuxt 内置 | `useHead`/`useSeoMeta` 开箱即用 |
| **统计** | Google Analytics 4 + 百度统计 | 双引擎覆盖 |

---

## 2️⃣ 项目结构（Nuxt 3 规范）

```
wuyoai.com/
├── app.vue                  # 根组件
├── nuxt.config.ts           # Nuxt 配置
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── og-image.png
├── assets/
│   └── css/
│       └── main.css         # UnoCSS 入口
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
│   ├── AppHeader.vue        # 顶部导航
│   ├── AppFooter.vue        # 底部信息
│   ├── SearchBar.vue        # 搜索框
│   ├── ToolCard.vue         # 工具卡片
│   ├── CategoryNav.vue      # 分类侧边栏
│   ├── HeroBanner.vue       # 首页 Banner
│   └── SubmitForm.vue       # 提交表单
├── composables/
│   ├── useTools.ts          # 工具数据获取
│   └── useSearch.ts         # 搜索逻辑
├── data/
│   ├── tools.json           # 工具数据库（核心）
│   └── categories.json      # 分类定义
└── server/
    └── api/
        └── tools.get.ts   # 预留 API 层（Phase 2 用）
```

---

## 3️⃣ 关键实现说明

### 3.1 数据层实现

**data/tools.json**（工具数据库）
```json
[
  {
    "id": "chatgpt",
    "name": "ChatGPT",
    "url": "https://chat.openai.com",
    "logo": "/logos/chatgpt.png",
    "description": "OpenAI 旗下最流行的 AI 对话工具...",
    "categories": ["chat", "writing", "code"],
    "tags": ["免费", "GPT-4"],
    "featured": true
  }
  // ... 200+ 工具
]
```

**composables/useTools.ts**（数据获取）
```ts
// Phase 1: 直接 import（最简单，SSG 友好，零网络请求）
import toolsData from '~/data/tools.json'

export const useTools = () => {
  return { data: toolsData }
}

// Phase 2 起：改用 API 层
// export const useTools = () => {
//   return useAsyncData('tools', () => $fetch('/api/tools'))
// }
```

### 3.2 首页核心代码

**pages/index.vue**
```vue
<script setup>
const { data: tools } = await useTools()
const featuredTools = computed(() => 
  tools.value?.filter(t => t.featured) || []
)
</script>

<template>
  <div>
    <!-- 顶部导航 -->
    <AppHeader />

    <!-- Hero Banner -->
    <HeroBanner />

    <!-- 精选推荐 -->
    <div class="container">
      <h2>🔥 精选推荐</h2>
      <div class="grid">
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

### 3.3 SEO 优化

**nuxt.config.ts**
```ts
export default defineNuxtConfig({
  app: {
    head: {
      title: '无忧AI - 发现最好用的 AI 工具',
      meta: [
        { name: 'description', content: '中文 AI 工具导航站，收录 200+ AI 写作、绘图、编程等工具' }
      ]
    }
  },
  routeRules: {
    '/': { sitemap: true }
  }
})
```

**动态页面 SEO**
```vue
<script setup>
const route = useRoute()
const { data: tool } = await useTool(route.params.slug)

useHead(() => ({
  title: `${tool.value?.name} - 无忧AI 工具库`,
  meta: [
    { name: 'description', content: tool.value?.description }
  ]
}))
</script>
```

---

## 4️⃣ 分类体系与数据结构（同前）

分类体系和工具数据结构与原方案一致，此处省略，详见 `data/` 目录。

---

## 5️⃣ 项目初始化步骤

```bash
# 1. 创建 Nuxt 3 项目
npx nuxi init wuyoai.com

# 2. 进入项目目录
cd wuyoai.com

# 3. 安装依赖
npm install

# 4. 添加 UnoCSS（推荐，轻量级）
npm install -D @unocss/nuxt

# 5. 创建 Nuxt 配置
npx nuxi prepare

# 6. 目录结构初始化
mkdir -p data public/logos server/api
```

**nuxt.config.ts 配置**
```ts
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  nitro: {
    prerender: {
      // 预渲染静态页面
      routes: ['/', '/about', '/submit'],
      // 自动爬取所有链接，保证动态路由也生成独立 HTML
      crawlLinks: true
    }
  }
})
```

---

## 6️⃣ 本地开发与构建

```bash
# 开发模式（热重载）
npm run dev

# 生成静态站点（SSG）
npm run generate

# 查看预览
npm run preview
```

**SSG 输出**：
- 生成 `dist/` 目录，包含完整 HTML
- 每个页面独立 HTML 文件，SEO 友好
- 零服务器依赖

---

## 7️⃣ 部署方案

### Vercel 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd wuyoai.com
vercel --prod

# 4. 绑定域名
vercel domains add wuyoai.com
```

### DNS 配置

```
# wuyoai.com DNS 设置
Type   Name   Value
A      @      76.76.21.21        (Vercel IP)
CNAME  www    cname.vercel-dns.com
```

---

## 8️⃣ 渐进式演进路径

### Phase 1（现在）
- ✅ 用 `data/tools.json` + SSG
- ✅ 静态 HTML，零服务器依赖

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

## 9️⃣ 上线后运营

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
| M2 - 数据完整 | 收录 200+ AI 工具，15 个分类 |
| M3 - 搜索可用 | 关键词搜索返回正确结果 |
| M4 - SEO 就绪 | Google/百度已提交 sitemap |
| M5 - 上线部署 | wuyoai.com 可通过域名访问 |

---

*方案由贾维斯于 2026-05-11 按 Nuxt 3 + 本地 JSON 优化*
