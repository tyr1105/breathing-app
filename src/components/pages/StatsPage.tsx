import { motion } from 'framer-motion'
import { statsManager, historyManager } from '../../utils/storage'
import { useMemo } from 'react'

export function StatsPage() {
  const stats = statsManager.get()
  const history = historyManager.getAll()
  
  const totalBreaths = useMemo(() => {
    return history.reduce((sum, s) => sum + s.rounds * s.breathsPerRound, 0)
  }, [history])
  
  const totalTime = useMemo(() => {
    return history.reduce((sum, s) => sum + s.totalHoldTime, 0)
  }, [history])
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return sec > 0 ? `${min}分${sec}秒` : `${min}分钟`
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-6" style={{ paddingTop: 'max(env(safe-area-inset-top), 24px)' }}>
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-light text-zen-text mb-1">训练数据</h1>
          <p className="text-xs text-zen-text-dim">你的呼吸训练统计</p>
        </motion.div>
        
        {/* 统计卡片 */}
        <motion.div 
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-zen-bg-light/50 rounded-2xl p-4 border border-zen-accent/10">
            <div className="text-3xl font-light text-zen-accent">{stats.totalSessions}</div>
            <div className="text-xs text-zen-text-dim mt-1">训练次数</div>
          </div>
          <div className="bg-zen-bg-light/50 rounded-2xl p-4 border border-zen-accent/10">
            <div className="text-3xl font-light text-zen-gold">{stats.consecutiveDays}</div>
            <div className="text-xs text-zen-text-dim mt-1">连续天数</div>
          </div>
          <div className="bg-zen-bg-light/50 rounded-2xl p-4 border border-zen-accent/10">
            <div className="text-2xl font-light text-zen-accent">{formatTime(stats.personalBestHold)}</div>
            <div className="text-xs text-zen-text-dim mt-1">最长憋气</div>
          </div>
          <div className="bg-zen-bg-light/50 rounded-2xl p-4 border border-zen-accent/10">
            <div className="text-3xl font-light text-zen-accent">{totalBreaths}</div>
            <div className="text-xs text-zen-text-dim mt-1">呼吸次数</div>
          </div>
        </motion.div>
        
        {/* 总时长 */}
        <motion.div 
          className="bg-zen-bg-light/30 rounded-2xl p-4 border border-zen-accent/5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs text-zen-text-dim mb-2">总憋气时长</div>
          <div className="text-4xl font-light text-zen-accent">{formatTime(totalTime)}</div>
        </motion.div>
        
        {/* 训练历史 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium text-zen-text">训练历史</h2>
            <span className="text-xs text-zen-text-dim">{history.length} 次</span>
          </div>
          
          <div className="space-y-2">
            {history.slice(0, 10).map((session, index) => (
              <motion.div
                key={session.id}
                className="bg-zen-bg-light/30 rounded-xl p-3 border border-zen-accent/5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-zen-text">
                      {new Date(session.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-zen-text-dim">{session.rounds}轮 × {session.breathsPerRound}次</div>
                  </div>
                  <div className="text-zen-accent text-sm">{formatTime(session.totalHoldTime)}</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {history.length === 0 && (
            <div className="text-center py-8 text-zen-text-dim text-sm">
              暂无训练记录
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
