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

  return (
    <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full animate-fade-in">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-3xl sm:text-4xl font-light text-zen-accent mb-2">
            训练完成
          </h2>
          <p className="text-zen-text-dim">恭喜完成 {totalRounds} 轮呼吸训练</p>
        </div>

        {/* 统计卡片 */}
        <div className="bg-zen-bg-light rounded-2xl p-6 sm:p-8 mb-6 border border-zen-accent/10 shadow-2xl">
          {/* 总时长 */}
          <div className="text-center mb-6 pb-6 border-b border-zen-accent/10">
            <div className="text-sm text-zen-text-dim mb-2">总憋气时长</div>
            <div className="text-5xl sm:text-6xl font-light text-zen-accent">
              {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
            </div>
          </div>

          {/* 各轮详情 */}
          <div className="space-y-3 mb-6">
            <div className="text-sm text-zen-text-dim mb-3">各轮憋气时长</div>
            {roundHoldTimes.map((time, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-zen-text">第 {index + 1} 轮</span>
                <span className="text-zen-accent font-medium">
                  {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zen-accent/10">
            <div className="text-center">
              <div className="text-xs text-zen-text-dim mb-1">平均</div>
              <div className="text-lg sm:text-xl font-medium text-zen-text">
                {avgTime}s
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-zen-text-dim mb-1">最长</div>
              <div className="text-lg sm:text-xl font-medium text-zen-gold">
                {maxTime}s
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-zen-text-dim mb-1">最短</div>
              <div className="text-lg sm:text-xl font-medium text-zen-text-dim">
                {minTime}s
              </div>
            </div>
          </div>
        </div>

        {/* 重新开始按钮 */}
        <button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                     text-zen-accent rounded-xl transition-all font-medium text-lg
                     active:scale-98"
        >
          再来一次
        </button>

        {/* 提示 */}
        <p className="text-center text-xs text-zen-text-dim mt-6">
          坚持每天练习，效果更佳 💪
        </p>
      </div>
    </div>
  )
}
