export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
  },
  nitro: {
    prerender: {
      routes: ['/zh/', '/en/', '/zh/about', '/en/about', '/zh/submit', '/en/submit'],
      crawlLinks: true,
    },
  },
  app: {
    head: {
      title: '无忧AI - 发现最好用的 AI 工具',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'description', content: '中文 AI 工具导航站，收录 150+ AI 写作、绘图、编程等工具，帮你发现最好用的 AI 工具' },
        { name: 'keywords', content: 'AI工具,人工智能,ChatGPT,Midjourney,Cursor,AI写作,AI绘画,AI编程,AI导航' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '无忧AI - 发现最好用的 AI 工具' },
        { property: 'og:description', content: '中文 AI 工具导航站，收录 150+ AI 写作、绘图、编程等工具' },
        { property: 'og:image', content: 'https://wuyoai.com/Logo.png' },
        { property: 'og:url', content: 'https://wuyoai.com' },
        { property: 'og:site_name', content: '无忧AI' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '无忧AI - 发现最好用的 AI 工具' },
        { name: 'twitter:description', content: '中文 AI 工具导航站，收录 150+ AI 写作、绘图、编程等工具' },
        { name: 'twitter:image', content: 'https://wuyoai.com/Logo.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/label.png' },
        { rel: 'canonical', href: 'https://wuyoai.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
