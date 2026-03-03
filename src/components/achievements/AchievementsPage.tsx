import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
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

  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
        >
          <div className="bg-zen-bg-light border border-zen-gold/30 rounded-2xl px-6 py-4 shadow-xl flex items-center gap-4">
            <div className="text-4xl">{achievement.icon}</div>
            <div>
              <div className="text-zen-gold font-medium">成就解锁!</div>
              <div className="text-zen-text">{achievement.name}</div>
              <div className="text-zen-text-dim text-sm">{achievement.description}</div>
            </div>
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
  const achievements = [
    { id: 'first-training', name: '初次尝试', description: '完成第一次训练', icon: '🎯' },
    { id: 'streak-3', name: '连续3天', description: '连续训练3天', icon: '🔥' },
    { id: 'streak-7', name: '一周坚持', description: '连续训练7天', icon: '🌟' },
    { id: 'streak-30', name: '月度冠军', description: '连续训练30天', icon: '👑' },
    { id: 'hold-30', name: '憋气新手', description: '憋气达到30秒', icon: '💨' },
    { id: 'hold-60', name: '憋气达人', description: '憋气达到1分钟', icon: '💪' },
    { id: 'hold-90', name: '憋气大师', description: '憋气达到90秒', icon: '🏆' },
    { id: 'hold-120', name: '冰人附体', description: '憋气达到2分钟', icon: '❄️' },
    { id: 'sessions-10', name: '勤奋学员', description: '完成10次训练', icon: '📚' },
    { id: 'sessions-50', name: '呼吸专家', description: '完成50次训练', icon: '🎖️' },
    { id: 'sessions-100', name: '呼吸大师', description: '完成100次训练', icon: '🏅' },
  ]

  const unlockedCount = achievements.filter(a => unlockedIds.includes(a.id)).length

  return (
    <div className="h-full overflow-y-auto bg-zen-bg p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-zen-bg py-2 z-10">
          <button onClick={onBack} className="text-zen-text-dim hover:text-zen-text text-lg">← 返回</button>
          <h2 className="text-xl font-semibold text-zen-text">成就</h2>
          <div className="w-12" />
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-light text-zen-gold">{unlockedCount} / {achievements.length}</div>
          <div className="text-zen-text-dim text-sm">已解锁</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4">
          {achievements.map((achievement, index) => {
            const isUnlocked = unlockedIds.includes(achievement.id)
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
                <div className={`text-5xl mb-3 ${!isUnlocked && 'grayscale opacity-20'}`}>
                  {achievement.icon}
                </div>
                <div className={`font-medium text-sm mb-1 ${isUnlocked ? 'text-zen-text' : 'text-zen-text-dim'}`}>
                  {achievement.name}
                </div>
                <div className="text-zen-text-dim text-xs">
                  {achievement.description}
                </div>
                {isUnlocked && (
                  <div className="mt-2 flex items-center justify-center">
                    <span className="text-zen-gold text-xs">✓ 已解锁</span>
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
