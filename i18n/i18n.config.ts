export default defineI18nConfig(async () => ({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh: await import('../locales/zh.json').then(m => m.default),
    en: await import('../locales/en.json').then(m => m.default),
  },
}))
