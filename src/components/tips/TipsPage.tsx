import { motion } from 'framer-motion'

interface TipsPageProps {
  onBack: () => void
}

export function TipsPage({ onBack }: TipsPageProps) {
  const tips = [
    {
      icon: '🌬️',
      title: '什么是冰人呼吸法？',
      content: '由荷兰"冰人" Wim Hof 开发的呼吸技巧，结合深呼吸、憋气和冥想，被认为可以增强免疫力、提升能量、减轻压力。',
    },
    {
      icon: '🫁',
      title: '如何呼吸？',
      content: '深吸气（2秒）→ 用力呼气（1秒）→ 重复30次 → 憋气 → 恢复呼吸15秒 → 重复3轮',
    },
    {
      icon: '🧘',
      title: '注意事项',
      content: '放松身体，专注呼吸。吸气时让空气自然进入腹部，呼气时自然放松。不要刻意憋气过久。',
    },
    {
      icon: '⏰',
      title: '最佳训练时间',
      content: '早晨空腹或睡前2小时训练效果最佳。每天训练1-2次，坚持21天形成习惯。',
    },
    {
      icon: '⚠️',
      title: '安全提示',
      content: '请勿在水中、驾驶时或站立时练习。如有心脏病、高血压、癫痫等疾病，请先咨询医生。',
    },
    {
      icon: '❄️',
      title: '进阶训练',
      content: '熟练后可尝试冷水澡配合呼吸法，逐步提升耐寒能力和身体素质。',
    },
  ]

  return (
    <div className="min-h-screen bg-zen-bg p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-zen-text-dim hover:text-zen-text text-lg">← 返回</button>
          <h2 className="text-xl font-semibold text-zen-text">呼吸技巧</h2>
          <div className="w-12" />
        </div>

        <div className="space-y-4">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="bg-zen-bg-light rounded-2xl p-5 border border-zen-accent/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{tip.icon}</div>
                <div className="flex-1">
                  <h3 className="text-zen-text font-medium mb-2">{tip.title}</h3>
                  <p className="text-zen-text-dim text-sm leading-relaxed">{tip.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a 
            href="https://www.wimhofmethod.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zen-accent text-sm hover:underline"
          >
            了解更多关于 Wim Hof Method →
          </a>
        </div>
      </div>
    </div>
  )
}
