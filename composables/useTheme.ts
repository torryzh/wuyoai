export const useTheme = () => {
  const isDark = useState('theme', () => true)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      document.documentElement.classList.toggle('light-mode', !isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      if (saved === 'light') {
        isDark.value = false
        document.documentElement.classList.add('light-mode')
      }
    }
  }

  return { isDark, toggleTheme, initTheme }
}
