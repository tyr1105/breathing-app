// 训练历史管理
export interface TrainingRecord {
  id: string
  date: string
  rounds: number
  breathsPerRound: number
  holdTimes: number[]
  totalHoldTime: number
}

const STORAGE_KEY = 'breathing-training-history'

export const historyManager = {
  // 获取所有历史记录
  getAll(): TrainingRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  // 添加一条记录
  add(record: Omit<TrainingRecord, 'id' | 'date'>): TrainingRecord {
    const newRecord: TrainingRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    
    const history = this.getAll()
    history.unshift(newRecord)
    
    // 保留最近 30 条记录
    const trimmed = history.slice(0, 30)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    
    return newRecord
  },

  // 清空历史
  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  // 获取统计数据
  getStats(): {
    totalSessions: number
    totalBreaths: number
    avgHoldTime: number
    maxHoldTime: number
  } {
    const history = this.getAll()
    
    if (history.length === 0) {
      return { totalSessions: 0, totalBreaths: 0, avgHoldTime: 0, maxHoldTime: 0 }
    }
    
    const totalBreaths = history.reduce((sum, r) => sum + r.rounds * r.breathsPerRound, 0)
    const allHoldTimes = history.flatMap(r => r.holdTimes)
    const avgHoldTime = Math.round(allHoldTimes.reduce((a, b) => a + b, 0) / allHoldTimes.length)
    const maxHoldTime = Math.max(...allHoldTimes)
    
    return {
      totalSessions: history.length,
      totalBreaths,
      avgHoldTime,
      maxHoldTime,
    }
  }
}

// 设置管理
export interface Settings {
  breathsPerRound: number
  totalRounds: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  recoveryTime: number
}

const SETTINGS_KEY = 'breathing-settings'

const DEFAULT_SETTINGS: Settings = {
  breathsPerRound: 30,
  totalRounds: 3,
  soundEnabled: true,
  vibrationEnabled: true,
  recoveryTime: 15,
}

export const settingsManager = {
  get(): Settings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY)
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  save(settings: Partial<Settings>): Settings {
    const current = this.get()
    const updated = { ...current, ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    return updated
  },

  reset(): Settings {
    localStorage.removeItem(SETTINGS_KEY)
    return DEFAULT_SETTINGS
  }
}
