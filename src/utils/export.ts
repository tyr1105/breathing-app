// 数据导出功能
import type { TrainingRecord, UserStats } from './storage'

export interface ExportData {
  exportDate: string
  version: string
  stats: UserStats
  history: TrainingRecord[]
}

export const exportManager = {
  export(): string {
    const statsStr = localStorage.getItem('breathing-user-stats')
    const historyStr = localStorage.getItem('breathing-training-history')
    
    const data: ExportData = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      stats: statsStr ? JSON.parse(statsStr) : {},
      history: historyStr ? JSON.parse(historyStr) : [],
    }
    
    return JSON.stringify(data, null, 2)
  },

  download(): void {
    const data = this.export()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `breathing-training-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  import(jsonString: string): boolean {
    try {
      const data: ExportData = JSON.parse(jsonString)
      
      if (data.stats) {
        localStorage.setItem('breathing-user-stats', JSON.stringify(data.stats))
      }
      
      if (data.history && Array.isArray(data.history)) {
        localStorage.setItem('breathing-training-history', JSON.stringify(data.history))
      }
      
      return true
    } catch {
      return false
    }
  },
}
