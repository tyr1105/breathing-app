import { motion } from 'framer-motion'
import { historyManager, statsManager } from '../../utils/storage'

interface HistoryPageProps {
  onBack: () => void
}

export function HistoryPage({ onBack }: HistoryPageProps) {
  const history = historyManager.getAll()
  const stats = statsManager.get()
  const last7Days = historyManager.getLast7Days()

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return min > 0 ? `${min}分${sec}秒` : `${sec}秒`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const formatDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return `周${days[date.getDay()]}`
  }

  const maxAvgHold = Math.max(...last7Days.map(d => d.avgHold), 1)

  return (
    <div className="fullscreen-page-top bg-zen-bg p-4 sm:p-6">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-zen-text-dim hover:text-zen-text text-lg">← 返回</button>
          <h2 className="text-xl font-semibold text-zen-text">训练历史</h2>
          <div className="w-12" />
        </div>

        {stats.totalSessions > 0 && (
          <motion.div 
            className="grid grid-cols-2 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
              <div className="text-3xl font-light text-zen-accent">{stats.totalSessions}</div>
              <div className="text-xs text-zen-text-dim mt-1">训练次数</div>
            </div>
            <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
              <div className="text-3xl font-light text-zen-gold">{stats.consecutiveDays}</div>
              <div className="text-xs text-zen-text-dim mt-1">连续天数</div>
            </div>
            <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
              <div className="text-2xl font-light text-zen-accent">{formatDuration(stats.personalBestHold)}</div>
              <div className="text-xs text-zen-text-dim mt-1">最长憋气</div>
            </div>
            <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
              <div className="text-3xl font-light text-zen-accent">{historyManager.getStats().totalBreaths}</div>
              <div className="text-xs text-zen-text-dim mt-1">总呼吸次数</div>
            </div>
          </motion.div>
        )}

        {stats.totalSessions > 0 && (
          <motion.div 
            className="bg-zen-bg-light rounded-2xl p-5 mb-6 border border-zen-accent/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-sm text-zen-text-dim mb-4">最近7天训练</div>
            
            <div className="flex items-end justify-between h-24 gap-2">
              {last7Days.map((day, index) => {
                const height = day.sessions > 0 ? Math.max((day.avgHold / maxAvgHold) * 100, 10) : 5
                const hasSession = day.sessions > 0
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-zen-text-dim">{formatDayName(day.date)}</div>
                    <motion.div 
                      className={`w-full rounded-t ${hasSession ? 'bg-zen-accent/40' : 'bg-zen-accent/10'}`}
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    />
                    <div className="text-xs text-zen-text-dim">
                      {day.sessions > 0 ? day.sessions : '-'}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-zen-text-dim">还没有训练记录</p>
            <p className="text-zen-text-dim text-sm mt-2">完成第一次训练后这里会显示</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 20).map((record, index) => (
              <motion.div 
                key={record.id} 
                className="bg-zen-bg-light rounded-xl p-4 border border-zen-accent/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zen-text-dim text-sm">{formatDate(record.date)}</span>
                  <span className="text-zen-text text-sm">{record.rounds}轮 × {record.breathsPerRound}次</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {record.holdTimes.map((time, i) => (
                    <div key={i} className="flex-1 bg-zen-bg rounded-lg p-2 text-center">
                      <div className="text-xs text-zen-text-dim">第{i + 1}轮</div>
                      <div className="text-zen-accent font-medium">{formatDuration(time)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-zen-text-dim text-sm mt-3">
                  总憋气: {formatDuration(record.totalHoldTime)}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('确定要清空所有训练记录吗？')) {
                historyManager.clear()
                onBack()
              }
            }}
            className="w-full mt-6 py-3 text-zen-text-dim text-sm hover:text-zen-text"
          >
            清空历史记录
          </button>
        )}
      </div>
    </div>
  )
}
