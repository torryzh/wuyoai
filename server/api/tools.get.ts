export default defineEventHandler(() => {
  return import('~/data/tools.json').then(m => m.default)
})
