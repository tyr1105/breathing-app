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
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        width: '300px',
        height: '300px',
        willChange: 'transform', // 性能优化（第 27 轮学习）
        transform: 'translateZ(0)', // GPU 加速
      }}
    >
      {/* 第 1 层：最外层森林光晕 - 优化版（第 35 轮学习） */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 173, 86, 0.06) 0%, transparent 60%)',
          filter: 'blur(15px)', // ⬇️ 20px → 15px（性能优化）
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.15 : 0.95) : 1, // ⬇️ 1.8/1.2 → 1.15/0.95
          opacity: isActive ? [0.2, 0.35, 0.2] : 0.08, // ⬇️ 0.3/0.6 → 0.2/0.35
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* 第 2 层：中间光晕 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 173, 86, 0.12) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.12 : 0.96) : 1, // ⬇️ 1.5/1.05 → 1.12/0.96
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      />
      
      {/* 第 3 层：外层光环 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 173, 86, 0.18) 0%, rgba(95, 173, 86, 0.06) 100%)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.10 : 0.97) : 1, // ⬇️ 1.4/1 → 1.10/0.97
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      />
      
      {/* 第 4 层：中层光环 */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 173, 86, 0.25) 0%, rgba(95, 173, 86, 0.10) 100%)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.08 : 0.98) : 1, // ⬇️ 1.3/0.95 → 1.08/0.98
        }}
        transition={{
          duration,
          ease: currentEasing,
        }}
      />
      
      {/* 第 5 层：主圆圈 - 增强森林光晕效果 */}
      <motion.div
        className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(95, 173, 86, 0.45) 0%, rgba(95, 173, 86, 0.20) 100%)',
          boxShadow: isActive 
            ? '0 0 50px rgba(95, 173, 86, 0.5), 0 0 80px rgba(95, 173, 86, 0.25)' // ⬇️ 简化光晕
            : '0 0 30px rgba(95, 173, 86, 0.2)',
          border: '2px solid rgba(95, 173, 86, 0.5)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.12 : 0.94) : 1, // ⬇️ 1.25/0.85 → 1.12/0.94（12% 变化）
          opacity: isActive ? [0.7, 0.9, 0.7] : 0.6, // ✨ 新增透明度动画
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* 中心点 - 心脏跳动效果（增强版） */}
        <motion.div
          className="w-5 h-5 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(168, 213, 186, 0.9) 0%, rgba(95, 173, 86, 0.5) 100%)', // ⬆️ 增强中心点
            boxShadow: '0 0 25px rgba(168, 213, 186, 0.7)', // ⬆️ 增强发光
          }}
          animate={{
            scale: isActive ? (isBreathingIn ? 1.3 : 0.85) : 1, // ⬇️ 1.8/0.7 → 1.3/0.85（30% 变化）
            opacity: isActive ? 1 : 0.7,
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
