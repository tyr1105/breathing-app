import type { TrainingRecord } from '../../utils/storage'
import { historyManager } from '../../utils/storage'

interface HistoryPageProps {
  onBack: () => void
}

export function HistoryPage({ onBack }: HistoryPageProps) {
  const history = historyManager.getAll()
  const stats = historyManager.getStats()

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${String(sec).padStart(2, '0')}`
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

  return (
    <div className="min-h-screen bg-zen-bg p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-zen-text-dim hover:text-zen-text text-lg"
          >
            ← 返回
          </button>
          <h2 className="text-xl font-semibold text-zen-text">训练历史</h2>
          <div className="w-12" />
        </div>

        {/* 统计卡片 */}
        {stats.totalSessions > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-zen-bg-light rounded-xl p-4 text-center border border-zen-accent/10">
              <div className="text-2xl font-light text-zen-accent">{stats.totalSessions}</div>
              <div className="text-xs text-zen-text-dim mt-1">训练次数</div>
            </div>
            <div className="bg-zen-bg-light rounded-xl p-4 text-center border border-zen-accent/10">
              <div className="text-2xl font-light text-zen-accent">{stats.totalBreaths}</div>
              <div className="text-xs text-zen-text-dim mt-1">总呼吸次数</div>
            </div>
            <div className="bg-zen-bg-light rounded-xl p-4 text-center border border-zen-accent/10">
              <div className="text-2xl font-light text-zen-gold">{formatDuration(stats.avgHoldTime)}</div>
              <div className="text-xs text-zen-text-dim mt-1">平均憋气</div>
            </div>
            <div className="bg-zen-bg-light rounded-xl p-4 text-center border border-zen-accent/10">
              <div className="text-2xl font-light text-zen-gold">{formatDuration(stats.maxHoldTime)}</div>
              <div className="text-xs text-zen-text-dim mt-1">最长憋气</div>
            </div>
          </div>
        )}

        {/* 历史列表 */}
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-zen-text-dim">还没有训练记录</p>
            <p className="text-zen-text-dim text-sm mt-2">完成第一次训练后这里会显示</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => (
              <HistoryCard key={record.id} record={record} formatDuration={formatDuration} formatDate={formatDate} />
            ))}
          </div>
        )}

        {/* 清空按钮 */}
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

function HistoryCard({ 
  record, 
  formatDuration, 
  formatDate 
}: { 
  record: TrainingRecord
  formatDuration: (s: number) => string
  formatDate: (s: string) => string
}) {
  return (
    <div className="bg-zen-bg-light rounded-xl p-4 border border-zen-accent/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-zen-text-dim text-sm">{formatDate(record.date)}</span>
        <span className="text-zen-text text-sm">
          {record.rounds}轮 × {record.breathsPerRound}次
        </span>
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
        总憋气时长: {formatDuration(record.totalHoldTime)}
      </div>
    </div>
  )
}
