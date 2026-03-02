// 成就系统
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-training',
    name: '初次尝试',
    description: '完成第一次训练',
    icon: '🎯',
  },
  {
    id: 'streak-3',
    name: '连续3天',
    description: '连续训练3天',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    name: '一周坚持',
    description: '连续训练7天',
    icon: '🌟',
  },
  {
    id: 'streak-30',
    name: '月度冠军',
    description: '连续训练30天',
    icon: '👑',
  },
  {
    id: 'hold-30',
    name: '憋气新手',
    description: '憋气达到30秒',
    icon: '💨',
  },
  {
    id: 'hold-60',
    name: '憋气达人',
    description: '憋气达到1分钟',
    icon: '💪',
  },
  {
    id: 'hold-90',
    name: '憋气大师',
    description: '憋气达到90秒',
    icon: '🏆',
  },
  {
    id: 'hold-120',
    name: '冰人附体',
    description: '憋气达到2分钟',
    icon: '❄️',
  },
  {
    id: 'sessions-10',
    name: '勤奋学员',
    description: '完成10次训练',
    icon: '📚',
  },
  {
    id: 'sessions-50',
    name: '呼吸专家',
    description: '完成50次训练',
    icon: '🎖️',
  },
  {
    id: 'sessions-100',
    name: '呼吸大师',
    description: '完成100次训练',
    icon: '🏅',
  },
]

export function checkAchievements(stats: {
  consecutiveDays: number
  totalSessions: number
  personalBestHold: number
  unlockedIds: string[]
}): Achievement[] {
  const newlyUnlocked: Achievement[] = []

  // 首次训练
  if (stats.totalSessions >= 1 && !stats.unlockedIds.includes('first-training')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'first-training')!)
  }

  // 连续天数
  if (stats.consecutiveDays >= 3 && !stats.unlockedIds.includes('streak-3')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'streak-3')!)
  }
  if (stats.consecutiveDays >= 7 && !stats.unlockedIds.includes('streak-7')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'streak-7')!)
  }
  if (stats.consecutiveDays >= 30 && !stats.unlockedIds.includes('streak-30')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'streak-30')!)
  }

  // 憋气时长
  if (stats.personalBestHold >= 30 && !stats.unlockedIds.includes('hold-30')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'hold-30')!)
  }
  if (stats.personalBestHold >= 60 && !stats.unlockedIds.includes('hold-60')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'hold-60')!)
  }
  if (stats.personalBestHold >= 90 && !stats.unlockedIds.includes('hold-90')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'hold-90')!)
  }
  if (stats.personalBestHold >= 120 && !stats.unlockedIds.includes('hold-120')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'hold-120')!)
  }

  // 训练次数
  if (stats.totalSessions >= 10 && !stats.unlockedIds.includes('sessions-10')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'sessions-10')!)
  }
  if (stats.totalSessions >= 50 && !stats.unlockedIds.includes('sessions-50')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'sessions-50')!)
  }
  if (stats.totalSessions >= 100 && !stats.unlockedIds.includes('sessions-100')) {
    newlyUnlocked.push(ACHIEVEMENTS.find(a => a.id === 'sessions-100')!)
  }

  return newlyUnlocked
}
