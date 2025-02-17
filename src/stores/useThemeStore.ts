export const useThemeStore = defineStore(
  'themeStore',
  () => {
    const currentTheme = ref<'light' | 'dark'>(
      localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light',
    )

    // 切换主题
    const toggleTheme = () => {
      currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', currentTheme.value)
    }

    // 动态切换 Tailwind 的 dark 类
    watchEffect(() => {
      if (currentTheme.value === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })

    return {
      currentTheme,
      toggleTheme,
    }
  },
  {
    persist: true,
  },
)
