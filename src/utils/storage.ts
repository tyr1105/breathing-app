// 存储管理
export interface TrainingRecord {
  id: string
  date: string
  rounds: number
  breathsPerRound: number
  holdTimes: number[]
  totalHoldTime: number
}

export interface Settings {
  breathsPerRound: number
  totalRounds: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  recoveryTime: number
  skipSafetyWarning: boolean
}

export interface UserStats {
  consecutiveDays: number
  totalSessions: number
  lastTrainingDate: string | null
  achievements: string[]
  personalBestHold: number
}

const STORAGE_KEYS = {
  HISTORY: 'breathing-training-history',
  SETTINGS: 'breathing-settings',
  STATS: 'breathing-user-stats',
}

const DEFAULT_SETTINGS: Settings = {
  breathsPerRound: 30,
  totalRounds: 3,
  soundEnabled: true,
  vibrationEnabled: true,
  recoveryTime: 15,
  skipSafetyWarning: false,
}

const DEFAULT_STATS: UserStats = {
  consecutiveDays: 0,
  totalSessions: 0,
  lastTrainingDate: null,
  achievements: [],
  personalBestHold: 0,
}

export const historyManager = {
  getAll(): TrainingRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(record: Omit<TrainingRecord, 'id' | 'date'>): TrainingRecord {
    const newRecord: TrainingRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    
    const history = this.getAll()
    history.unshift(newRecord)
    const trimmed = history.slice(0, 100) // 保留最近100条
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed))
    
    return newRecord
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY)
  },

  getStats() {
    const history = this.getAll()
    
    if (history.length === 0) {
      return { totalSessions: 0, totalBreaths: 0, avgHoldTime: 0, maxHoldTime: 0 }
    }
    
    const totalBreaths = history.reduce((sum, r) => sum + r.rounds * r.breathsPerRound, 0)
    const allHoldTimes = history.flatMap(r => r.holdTimes)
    const avgHoldTime = allHoldTimes.length > 0 
      ? Math.round(allHoldTimes.reduce((a, b) => a + b, 0) / allHoldTimes.length)
      : 0
    const maxHoldTime = allHoldTimes.length > 0 ? Math.max(...allHoldTimes) : 0
    
    return { totalSessions: history.length, totalBreaths, avgHoldTime, maxHoldTime }
  },

  // 获取最近7天的数据
  getLast7Days(): { date: string; sessions: number; avgHold: number }[] {
    const history = this.getAll()
    const days: { [key: string]: { sessions: number; holds: number[] } } = {}
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      days[key] = { sessions: 0, holds: [] }
    }
    
    history.forEach(record => {
      const key = record.date.split('T')[0]
      if (days[key]) {
        days[key].sessions++
        days[key].holds.push(...record.holdTimes)
      }
    })
    
    return Object.entries(days).map(([date, data]) => ({
      date,
      sessions: data.sessions,
      avgHold: data.holds.length > 0 
        ? Math.round(data.holds.reduce((a, b) => a + b, 0) / data.holds.length)
        : 0,
    }))
  },
}

export const settingsManager = {
  get(): Settings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  save(settings: Partial<Settings>): Settings {
    const current = this.get()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated))
    return updated
  },

  reset(): Settings {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    return DEFAULT_SETTINGS
  }
}

export const statsManager = {
  get(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS)
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS
    } catch {
      return DEFAULT_STATS
    }
  },

  updateTraining(): UserStats {
    const stats = this.get()
    const today = new Date().toISOString().split('T')[0]
    
    let consecutiveDays = stats.consecutiveDays
    if (stats.lastTrainingDate) {
      const lastDate = new Date(stats.lastTrainingDate)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        consecutiveDays++
      } else if (stats.lastTrainingDate.split('T')[0] !== today) {
        consecutiveDays = 1
      }
    } else {
      consecutiveDays = 1
    }
    
    const updated: UserStats = {
      ...stats,
      consecutiveDays,
      totalSessions: stats.totalSessions + 1,
      lastTrainingDate: today,
    }
    
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated))
    return updated
  },

  updatePersonalBest(holdTime: number): boolean {
    const stats = this.get()
    if (holdTime > stats.personalBestHold) {
      stats.personalBestHold = holdTime
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
      return true
    }
    return false
  },

  addAchievement(achievement: string): void {
    const stats = this.get()
    if (!stats.achievements.includes(achievement)) {
      stats.achievements.push(achievement)
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
    }
  },
}
