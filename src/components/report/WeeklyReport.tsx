import { BarChart3, Target, Wind, Timer, Flame } from 'lucide-react'
import { historyManager, statsManager } from '../../utils/storage'

interface WeeklyReportProps {
  onClose: () => void
}

export function WeeklyReport({ onClose }: WeeklyReportProps) {
  const history = historyManager.getAll()
  const stats = statsManager.get()
  const last7Days = historyManager.getLast7Days()

  const thisWeekSessions = last7Days.reduce((sum, d) => sum + d.sessions, 0)
  const thisWeekHoldTimes = history
    .filter(r => {
      const daysDiff = Math.floor((Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff < 7
    })
    .flatMap(r => r.holdTimes)

  const avgHold = thisWeekHoldTimes.length > 0
    ? Math.round(thisWeekHoldTimes.reduce((a, b) => a + b, 0) / thisWeekHoldTimes.length)
    : 0

  const totalBreaths = history
    .filter(r => {
      const daysDiff = Math.floor((Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff < 7
    })
    .reduce((sum, r) => sum + r.rounds * r.breathsPerRound, 0)

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return sec > 0 ? `${min}分${sec}秒` : `${min}分钟`
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
      <div className="bg-zen-bg-light rounded-3xl p-6 max-w-md w-full shadow-2xl border border-zen-accent/10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BarChart3 className="w-12 h-12 text-zen-accent" />
          </div>
          <h2 className="text-2xl font-light text-zen-text">本周训练报告</h2>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-zen-bg rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-zen-text-dim text-sm">训练次数</div>
              <div className="text-2xl font-light text-zen-accent">{thisWeekSessions} 次</div>
            </div>
            <Target className="w-8 h-8 text-zen-accent" />
          </div>

          <div className="bg-zen-bg rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-zen-text-dim text-sm">呼吸次数</div>
              <div className="text-2xl font-light text-zen-accent">{totalBreaths} 次</div>
            </div>
            <Wind className="w-8 h-8 text-zen-accent" />
          </div>

          <div className="bg-zen-bg rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-zen-text-dim text-sm">平均憋气</div>
              <div className="text-2xl font-light text-zen-accent">{formatTime(avgHold)}</div>
            </div>
            <Timer className="w-8 h-8 text-zen-accent" />
          </div>

          <div className="bg-zen-bg rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-zen-text-dim text-sm">连续天数</div>
              <div className="text-2xl font-light text-zen-gold">{stats.consecutiveDays} 天</div>
            </div>
            <Flame className="w-8 h-8 text-zen-gold" />
          </div>
        </div>

        {stats.consecutiveDays >= 7 ? (
          <div className="text-center text-zen-accent text-sm mb-6">
            🌟 太棒了！坚持了一周！继续保持！
          </div>
        ) : (
          <div className="text-center text-zen-text-dim text-sm mb-6">
            每天训练效果更佳，继续加油！
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-zen-accent/20 hover:bg-zen-accent/30 
                     text-zen-accent rounded-2xl transition-all font-medium"
        >
          关闭
        </button>
      </div>
    </div>
  )
}
