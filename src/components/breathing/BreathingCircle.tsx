import { motion } from 'framer-motion'

interface BreathingCircleProps {
  isBreathingIn: boolean
  isActive: boolean
}

export function BreathingCircle({ isBreathingIn, isActive }: BreathingCircleProps) {
  // Biomimetic 呼吸曲线 - 模拟自然呼吸节奏
  const inhaleEasing = [0.4, 0, 0.2, 1] as const // ease-out - 先快后慢
  const exhaleEasing = [0.4, 0, 0.6, 1] as const // ease-in-out - 两端慢中间快
  
  const currentEasing = isBreathingIn ? inhaleEasing : exhaleEasing
  const duration = isBreathingIn ? 2 : 1

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* 最外层生物发光光晕 - 新增 */}
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 60%)',
          filter: 'blur(20px)', // 有机模糊效果
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.8 : 1.2) : 1,
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.1,
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      {/* 最外层光晕 - 呼吸感脉动 */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(125, 212, 168, 0.15) 0%, rgba(125, 212, 168, 0.05) 40%, transparent 70%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.6 : 1.1) : 1,
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.2,
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* 第四层光环 - 新增 */}
      <motion.div
        className="absolute w-56 h-56 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(125, 212, 168, 0.08) 0%, transparent 60%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.5 : 1.05) : 1,
          opacity: isActive ? 0.5 : 0.2,
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      />
      
      {/* 第三层光环 */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-zen-accent/15"
        animate={{
          scale: isActive ? (isBreathingIn ? 1.4 : 1) : 1,
          opacity: isActive ? 0.6 : 0.3,
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      />
      
      {/* 第二层光环 */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(125, 212, 168, 0.2) 0%, rgba(125, 212, 168, 0.08) 100%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.3 : 0.95) : 1,
          opacity: isActive ? 0.7 : 0.4,
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      />
      
      {/* 主圆圈 - 增强生物发光效果 */}
      <motion.div
        className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(125, 212, 168, 0.35) 0%, rgba(125, 212, 168, 0.15) 100%)',
          boxShadow: isActive 
            ? '0 0 60px rgba(125, 212, 168, 0.4), 0 0 100px rgba(125, 212, 168, 0.2), 0 0 140px rgba(0, 255, 255, 0.15), inset 0 0 30px rgba(125, 212, 168, 0.15)'
            : '0 0 30px rgba(125, 212, 168, 0.15), 0 0 60px rgba(125, 212, 168, 0.08)',
          border: '2px solid rgba(125, 212, 168, 0.4)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.25 : 0.85) : 1,
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      >
        {/* 中心点 - 心脏跳动效果 */}
        <motion.div
          className="w-5 h-5 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(125, 212, 168, 0.8) 0%, rgba(0, 255, 255, 0.4) 100%)',
            boxShadow: '0 0 20px rgba(125, 212, 168, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)',
          }}
          animate={{
            scale: isActive ? (isBreathingIn ? 1.8 : 0.7) : 1,
            opacity: isActive ? 1 : 0.6,
          }}
          transition={{
            duration,
            ease: currentEasing,
          }}
        />
      </motion.div>
      
      {/* 呼吸状态指示文字 - 更大更清晰 */}
      {isActive && (
        <motion.div
          className="absolute -bottom-8 text-sm text-zen-accent/70 font-light tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isBreathingIn ? '吸气' : '呼气'}
        </motion.div>
      )}
    </div>
  )
}
