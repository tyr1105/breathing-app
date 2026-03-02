import { useRef, useEffect } from 'react'

export function useTimer(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // 保存最新的回调
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // 设置定时器
  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)
    
    return () => clearInterval(id)
  }, [delay])
}
