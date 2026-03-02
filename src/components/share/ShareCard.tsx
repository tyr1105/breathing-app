import { motion } from 'framer-motion'

interface ShareCardProps {
  roundHoldTimes: number[]
  totalRounds: number
  consecutiveDays: number
}

export function ShareCard({ roundHoldTimes, totalRounds, consecutiveDays }: ShareCardProps) {
  const totalTime = roundHoldTimes.reduce((a, b) => a + b, 0)
  const maxTime = Math.max(...roundHoldTimes)
  const avgTime = Math.round(totalTime / roundHoldTimes.length)

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return min > 0 ? `${min}分${sec}秒` : `${sec}秒`
  }

  const shareText = `🧊 冰人呼吸法训练完成！
 
📊 ${totalRounds}轮训练
⏱️ 总憋气时长: ${formatTime(totalTime)}
🏆 最长憋气: ${formatTime(maxTime)}
📈 平均憋气: ${formatTime(avgTime)}
${consecutiveDays > 1 ? `🔥 连续训练 ${consecutiveDays} 天` : ''}

#WimHofMethod #冰人呼吸法`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '冰人呼吸法训练记录',
          text: shareText,
        })
      } catch (err) {
        // 用户取消或分享失败
      }
    } else {
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareText)
      alert('已复制到剪贴板！')
    }
  }

  return (
    <motion.button
      onClick={handleShare}
      className="w-full py-3 px-6 bg-zen-bg-light hover:bg-zen-bg-light/80 
                 text-zen-text-dim rounded-2xl transition-all text-sm
                 border border-zen-accent/10 flex items-center justify-center gap-2"
      whileTap={{ scale: 0.98 }}
    >
      <span>📤</span>
      <span>分享训练成果</span>
    </motion.button>
  )
}
