import { motion } from 'framer-motion'

interface BreathingCircleProps {
  isBreathingIn: boolean
  isActive: boolean
}

export function BreathingCircle({ isBreathingIn, isActive }: BreathingCircleProps) {
  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* 最外层光晕 */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110, 231, 183, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.5 : 1.1) : 1,
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          scale: { duration: isBreathingIn ? 2 : 1, ease: 'easeInOut' },
          opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* 第三层光环 */}
      <motion.div
        className="absolute w-40 h-40 rounded-full border border-zen-accent/10"
        animate={{
          scale: isActive ? (isBreathingIn ? 1.4 : 1.05) : 1,
          opacity: isActive ? 0.4 : 0.2,
        }}
        transition={{
          duration: isBreathingIn ? 2 : 1,
          ease: 'easeInOut',
        }}
      />
      
      {/* 第二层光环 */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110, 231, 183, 0.15) 0%, rgba(110, 231, 183, 0.05) 100%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.3 : 1) : 1,
          opacity: isActive ? 0.6 : 0.3,
        }}
        transition={{
          duration: isBreathingIn ? 2 : 1,
          ease: 'easeInOut',
        }}
      />
      
      {/* 主圆圈 */}
      <motion.div
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(110, 231, 183, 0.3) 0%, rgba(110, 231, 183, 0.1) 100%)',
          boxShadow: isActive 
            ? '0 0 40px rgba(110, 231, 183, 0.3), inset 0 0 20px rgba(110, 231, 183, 0.1)'
            : '0 0 20px rgba(110, 231, 183, 0.1)',
          border: '2px solid rgba(110, 231, 183, 0.3)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.2 : 0.9) : 1,
        }}
        transition={{
          duration: isBreathingIn ? 2 : 1,
          ease: 'easeInOut',
        }}
      >
        {/* 中心点 */}
        <motion.div
          className="w-4 h-4 rounded-full bg-zen-accent/50"
          animate={{
            scale: isActive ? (isBreathingIn ? 1.5 : 0.8) : 1,
            opacity: isActive ? 1 : 0.5,
          }}
          transition={{
            duration: isBreathingIn ? 2 : 1,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      {/* 呼吸状态指示文字 */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 text-xs text-zen-accent/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isBreathingIn ? '吸气中...' : '呼气中...'}
        </motion.div>
      )}
    </div>
  )
}
