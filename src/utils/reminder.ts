// 训练提醒功能
export interface ReminderSettings {
  enabled: boolean
  hour: number
  minute: number
  message: string
}

const REMINDER_KEY = 'breathing-reminder'

const DEFAULT_REMINDER: ReminderSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
  message: '该进行今天的呼吸训练了！',
}

export const reminderManager = {
  get(): ReminderSettings {
    try {
      const data = localStorage.getItem(REMINDER_KEY)
      return data ? { ...DEFAULT_REMINDER, ...JSON.parse(data) } : DEFAULT_REMINDER
    } catch {
      return DEFAULT_REMINDER
    }
  },

  save(settings: Partial<ReminderSettings>): ReminderSettings {
    const current = this.get()
    const updated = { ...current, ...settings }
    localStorage.setItem(REMINDER_KEY, JSON.stringify(updated))
    return updated
  },

  // 请求通知权限
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    
    if (Notification.permission === 'granted') return true
    
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  },

  // 发送通知
  sendNotification(message?: string): void {
    if (Notification.permission !== 'granted') return
    
    new Notification('冰人呼吸法', {
      body: message || this.get().message,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'breathing-reminder',
    })
  },

  // 检查是否应该提醒（每分钟检查一次）
  checkAndNotify(): void {
    const settings = this.get()
    if (!settings.enabled) return

    const now = new Date()
    if (now.getHours() === settings.hour && now.getMinutes() === settings.minute) {
      this.sendNotification(settings.message)
    }
  },
}

// 启动提醒检查
export function startReminderCheck(): void {
  setInterval(() => reminderManager.checkAndNotify(), 60000)
}
