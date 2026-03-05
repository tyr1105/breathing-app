import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Target,
  Flame,
  Star,
  Crown,
  Wind,
  Dumbbell,
  Trophy,
  Snowflake,
  BookOpen,
  Medal,
  Award,
  type LucideIcon
} from 'lucide-react'
import { statsManager } from '../../utils/storage'
import { AchievementProgress } from './AchievementProgress'
import { ACHIEVEMENTS } from '../../utils/achievements'
import type { Achievement } from '../../utils/achievements'

// 图标映射表
const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  Flame,
  Star,
  Crown,
  Wind,
  Dumbbell,
  Trophy,
  Snowflake,
  BookOpen,
  Medal,
  Award,
}

// 获取成就进度的辅助函数
function getAchievementProgress(achievement: Achievement, stats: { consecutiveDays: number; totalSessions: number; personalBestHold: number }) {
  let current = 0
  let target = 0

  switch (achievement.id) {
    case 'first-training':
      current = stats.totalSessions
      target = 1
      break
    case 'streak-3':
      current = stats.consecutiveDays
      target = 3
      break
    case 'streak-7':
      current = stats.consecutiveDays
      target = 7
      break
    case 'streak-30':
      current = stats.consecutiveDays
      target = 30
      break
    case 'hold-30':
      current = stats.personalBestHold
      target = 30
      break
    case 'hold-60':
      current = stats.personalBestHold
      target = 60
      break
    case 'hold-90':
      current = stats.personalBestHold
      target = 90
      break
    case 'hold-120':
      current = stats.personalBestHold
      target = 120
      break
    case 'sessions-10':
      current = stats.totalSessions
      target = 10
      break
    case 'sessions-50':
      current = stats.totalSessions
      target = 50
      break
    case 'sessions-100':
      current = stats.totalSessions
      target = 100
      break
  }

  const percentage = Math.min(100, (current / target) * 100)
  return { current, target, percentage }
}

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onDismiss, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onDismiss])

  // 获取图标组件
  const IconComponent = achievement ? ICON_MAP[achievement.iconName] : null

  return (
    <AnimatePresence>
      {visible && achievement && IconComponent && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
        >
          <div className="bg-zen-bg-light border border-zen-gold/30 rounded-2xl px-6 py-4 shadow-xl flex items-center gap-4">
            <div className="text-zen-gold">
              <IconComponent className="w-10 h-10" />
            </div>
            <div className="text-zen-gold font-medium">成就解锁!</div>
            <div className="text-zen-text">{achievement.name}</div>
            <div className="text-zen-text-dim text-sm">{achievement.description}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface AchievementsPageProps {
  onBack: () => void
  unlockedIds: string[]
}

export function AchievementsPage({ onBack, unlockedIds }: AchievementsPageProps) {
  const stats = statsManager.get()
  const unlockedCount = unlockedIds.length
  const totalCount = ACHIEVEMENTS.length

  return (
    <div className="h-full overflow-y-auto bg-zen-bg">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        {/* 固定头部 */}
        <div className="sticky top-0 bg-zen-bg/95 backdrop-blur-sm z-50 pt-[env(safe-area-inset-top,0)] py-4 border-b border-zen-accent/10">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack} 
              className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 -ml-2"
            >
              ← 返回
            </button>
            <h2 className="text-xl font-semibold text-zen-text">成就</h2>
            <div className="w-12" />
          </div>
        </div>

        <div className="text-center py-6">
          <div className="text-3xl font-light text-zen-gold">{unlockedCount} / {totalCount}</div>
          <div className="text-zen-text-dim text-sm">已解锁</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-6">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = unlockedIds.includes(achievement.id)
            const IconComponent = ICON_MAP[achievement.iconName]

            if (!IconComponent) return null

            // 计算进度
            const progress = getAchievementProgress(achievement, stats)

            return (
              <motion.div
                key={achievement.id}
                className={`rounded-2xl p-5 border transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-zen-bg-light to-zen-bg border-zen-gold/30 shadow-lg shadow-zen-gold/10' 
                    : 'bg-zen-bg-light/30 border-zen-accent/5'
                }`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
              >
                {/* 进度指示器 */}
                {!isUnlocked && (
                  <AchievementProgress
                    achievement={achievement}
                    current={progress.current}
                    target={progress.target}
                    isUnlocked={isUnlocked}
                  />
                )}

                {/* 图标 */}
                <div className={`flex justify-center mb-3 ${!isUnlocked && 'grayscale opacity-20'}`}>
                  <IconComponent className={`w-12 h-12 ${isUnlocked ? 'text-zen-gold' : 'text-zen-text-dim'}`} />
                </div>

                {/* 名称和描述 */}
                <div className="text-center">
                  <div className={`font-medium text-sm mb-1 ${isUnlocked ? 'text-zen-text' : 'text-zen-text-dim'}`}>
                    {achievement.name}
                  </div>
                  <div className="text-zen-text-dim text-xs">
                    {achievement.description}
                  </div>
                </div>

                {/* 已解锁标签 */}
                {isUnlocked && (
                  <div className="mt-2 flex items-center justify-center">
                    <span className="text-zen-gold text-xs">✓ 已解锁</span>
                  </div>
                )}

                {/* 进度指示器 - 仅未解锁时显示 */}
                {!isUnlocked && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zen-text">{achievement.name}</span>
                      <span className="text-xs text-zen-gold">
                        {progress.current} / {progress.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zen-bg rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-zen-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}