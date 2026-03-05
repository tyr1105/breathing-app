import { motion } from 'framer-motion'
import type { Achievement } from '../../utils/achievements'

interface AchievementProgressProps {
  achievement: Achievement
  current: number
  target: number
  isUnlocked: boolean
}

export function AchievementProgress({ achievement, current, target, isUnlocked }: AchievementProgressProps) {
  const percentage = Math.min(100, (current / target) * 100)

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zen-text">{achievement.name}</span>
        <span className="text-xs text-zen-gold">{current} / {target}</span>
      </div>
      <div className="h-1.5 bg-zen-bg rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-zen-gold"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {isUnlocked && (
        <span className="text-xs text-zen-gold mt-1">✓ 已解锁</span>
      )}
    </div>
  )
}
