import { motion } from 'framer-motion'
import { statsManager } from '../../utils/storage'

interface TrainingSummaryProps {
  roundHoldTimes: number[]
  totalRounds: number
  onRestart: () => void
}

export function TrainingSummary({ roundHoldTimes, totalRounds, onRestart }: TrainingSummaryProps) {
  const totalTime = roundHoldTimes.reduce((sum, time) => sum + time, 0)
  const avgTime = Math.round(totalTime / roundHoldTimes.length)
  const maxTime = Math.max(...roundHoldTimes)
  const minTime = Math.min(...roundHoldTimes)
  const stats = statsManager.get()

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return min > 0 ? `${min}分${sec}秒` : `${sec}秒`
  }

  // 检查是否打破记录
  const isNewRecord = maxTime >= stats.personalBestHold

  return (
    <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* 庆祝动画 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-light text-zen-accent mb-2">
            训练完成
          </h2>
          <p className="text-zen-text-dim">太棒了！你完成了 {totalRounds} 轮训练</p>
          
          {isNewRecord && (
            <motion.div
              className="mt-4 bg-zen-gold/20 text-zen-gold px-4 py-2 rounded-full inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              🏆 新纪录！
            </motion.div>
          )}
        </motion.div>

        {/* 总时长卡片 */}
        <motion.div 
          className="bg-zen-bg-light rounded-3xl p-8 mb-6 border border-zen-accent/10 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm text-zen-text-dim mb-2">总憋气时长</div>
          <div className="text-5xl font-light text-zen-accent mb-4">
            {formatTime(totalTime)}
          </div>
          
          {/* 连续天数 */}
          {stats.consecutiveDays > 1 && (
            <div className="text-sm text-zen-gold">
              🔥 连续训练 {stats.consecutiveDays} 天
            </div>
          )}
        </motion.div>

        {/* 各轮详情 */}
        <motion.div 
          className="bg-zen-bg-light rounded-3xl p-6 mb-6 border border-zen-accent/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-zen-text-dim mb-4">各轮憋气时长</div>
          
          <div className="space-y-3">
            {roundHoldTimes.map((time, index) => {
              const percentage = (time / maxTime) * 100
              const isMax = time === maxTime
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-zen-text-dim text-sm w-16">第 {index + 1} 轮</span>
                  <div className="flex-1 h-3 bg-zen-bg rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${isMax ? 'bg-zen-gold/60' : 'bg-zen-accent/40'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className={`text-sm w-16 text-right ${isMax ? 'text-zen-gold' : 'text-zen-accent'}`}>
                    {formatTime(time)}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* 统计数据 */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
            <div className="text-2xl font-light text-zen-text">{formatTime(avgTime)}</div>
            <div className="text-xs text-zen-text-dim mt-1">平均</div>
          </div>
          <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
            <div className="text-2xl font-light text-zen-gold">{formatTime(maxTime)}</div>
            <div className="text-xs text-zen-text-dim mt-1">最长</div>
          </div>
          <div className="bg-zen-bg-light rounded-2xl p-4 text-center border border-zen-accent/10">
            <div className="text-2xl font-light text-zen-text-dim">{formatTime(minTime)}</div>
            <div className="text-xs text-zen-text-dim mt-1">最短</div>
          </div>
        </motion.div>

        {/* 重新开始按钮 */}
        <motion.button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                     text-zen-accent rounded-2xl transition-all font-medium text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          再来一次
        </motion.button>

        {/* 提示 */}
        <p className="text-center text-xs text-zen-text-dim mt-6">
          坚持每天练习，效果更佳 💪
        </p>
      </div>
    </div>
  )
}
