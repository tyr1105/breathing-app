import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { BreathingCircle } from '../breathing/BreathingCircle'
import { statsManager, historyManager } from '../../utils/storage'

// 获取时间问候语
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '早安'
  if (hour >= 12 && hour < 18) return '午安'
  return '晚安'
}

// 格式化时间
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

interface HomePageProps {
  onStartTraining: () => void
}

export function HomePage({ onStartTraining }: HomePageProps) {
  const stats = statsManager.get()
  const recentSessions = useMemo(() => {
    const history = historyManager.getAll()
    return history.slice(0, 2)
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 animate-fade-in w-full max-w-md mx-auto">
      {/* 顶部状态 */}
      <div className="w-full flex justify-between items-center mb-4">
        {stats.consecutiveDays > 0 ? (
          <motion.div 
            className="bg-zen-accent/10 px-3 py-1.5 rounded-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-zen-accent text-xs">🔥 {stats.consecutiveDays}天</span>
          </motion.div>
        ) : <div />}
        <div className="flex gap-2" style={{ paddingTop: 'env(safe-area-inset-top)' }} />
      </div>
      
      {/* 问候语 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-2"
      >
        <p className="text-zen-text-dim text-sm">{getGreeting()}</p>
      </motion.div>
      
      {/* 主标题 */}
      <motion.h1 
        className="text-3xl font-light text-zen-text mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        冰人呼吸法
      </motion.h1>
      <motion.p 
        className="text-zen-text-dim text-xs mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Wim Hof Method
      </motion.p>
      
      {/* 呼吸圆圈 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <BreathingCircle isBreathingIn={true} isActive={false} />
      </motion.div>
      
      {/* 开始按钮 - 点击触发中间按钮功能 */}
      <motion.button
        onClick={onStartTraining}
        className="mt-8 py-4 px-12 bg-zen-accent/20 hover:bg-zen-accent/30 
                   text-zen-accent rounded-2xl transition-all font-medium text-lg
                   active:scale-95"
        style={{
          boxShadow: '0 4px 30px rgba(125, 212, 168, 0.2)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ boxShadow: '0 6px 40px rgba(125, 212, 168, 0.3)' }}
        whileTap={{ scale: 0.95, boxShadow: '0 2px 20px rgba(125, 212, 168, 0.15)' }}
      >
        开始训练
      </motion.button>
      
      <motion.p 
        className="mt-4 text-xs text-zen-text-dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        4轮 × 30次呼吸
      </motion.p>

      {/* 最近训练 */}
      {recentSessions.length > 0 && (
        <motion.div
          className="mt-6 w-full text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-zen-text-dim mb-2 px-1">最近训练</p>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <motion.div
                key={session.id}
                className="bg-zen-bg-light/50 rounded-xl p-3 border border-zen-accent/5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-zen-text text-sm">{formatTime(new Date(session.date))}</span>
                    <span className="text-zen-text-dim text-xs ml-2">{session.rounds}轮</span>
                  </div>
                  <div className="text-zen-accent text-xs">
                    {Math.floor(session.totalHoldTime / 60)}:{String(session.totalHoldTime % 60).padStart(2, '0')} 憋气
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
