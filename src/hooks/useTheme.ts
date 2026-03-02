import { useState, useEffect } from 'react'
import type { Settings } from '../utils/storage'

export function useTheme(settings: Settings) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const applyTheme = () => {
      let dark = true
      
      if (settings.theme === 'light') {
        dark = false
      } else if (settings.theme === 'auto') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        dark = true
      }
      
      setIsDark(dark)
      document.documentElement.classList.toggle('light-theme', !dark)
    }

    applyTheme()

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (settings.theme === 'auto') {
        applyTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [settings.theme])

  return { isDark }
}
