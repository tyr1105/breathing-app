import { useEffect } from 'react'

type KeyHandler = () => void

export function useKeyboardShortcuts(shortcuts: Record<string, KeyHandler>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      
      // 忽略输入框中的快捷键
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      // 空格键 - 暂停/恢复
      if (key === ' ' && shortcuts.space) {
        event.preventDefault()
        shortcuts.space()
      }

      // Escape - 退出
      if (key === 'escape' && shortcuts.escape) {
        shortcuts.escape()
      }

      // Enter - 开始/确认
      if (key === 'enter' && shortcuts.enter) {
        shortcuts.enter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
