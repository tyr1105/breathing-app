import { useState, useEffect } from 'react'

// 简单的状态管理
export function createStore<T>(initialState: T) {
  let state = initialState
  const listeners = new Set<(state: T) => void>()

  return {
    getState: () => state,
    setState: (newState: T | ((prev: T) => T)) => {
      state = typeof newState === 'function' ? (newState as (prev: T) => T)(state) : newState
      listeners.forEach(listener => listener(state))
    },
    subscribe: (listener: (state: T) => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

// 使用 store 的 hook
export function useStore<T>(store: ReturnType<typeof createStore<T>>) {
  const [state, setState] = useState(store.getState())

  useEffect(() => {
    const unsubscribe = store.subscribe(setState)
    return () => { unsubscribe() }
  }, [store])

  return state
}
