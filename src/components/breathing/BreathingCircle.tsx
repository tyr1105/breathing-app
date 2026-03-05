import { motion } from 'framer-motion'

import { useMemo } from 'react'

interface BreathingCircleProps {
  isBreathingIn: boolean
  isActive: boolean
  breathPhase?: 'inhale' | 'exhale' | 'pause'  // 新增暂停状态
}

export function BreathingCircle({ isBreathingIn, isActive, breathPhase }: BreathingCircleProps) {
  // 方案 D: 添加暂停状态判断
  const isPaused = breathPhase === 'pause'
  
  // 有机圆角变化（方案 D）
  const organicRadius = useMemo(() => {
    const variation = () => 50 + (Math.random() * 4 - 2)  // 48-52% 变化
    return `${variation()}% ${variation()}% ${variation()}% ${variation()}% / ${variation()}% ${variation()}% ${variation()}% ${variation()}%`
  }, [])

  // 方案 D: 简化缓动曲线
  const inhaleEasing = [0.4, 0, 0.2, 1] as const // ease-out - 先快后慢
  const exhaleEasing = [0.4, 0, 0.6, 1] as const // ease-in-out - 两端慢中间快
  const pauseEasing = [0.25, 0.1, 0.25, 1] as const // ease-in-out - 柔和过渡
  
  // 方案 D: 根据呼吸阶段选择缓动曲线
  const currentEasing = isPaused ? pauseEasing : (isBreathingIn ? inhaleEasing : exhaleEasing)
  const duration = isPaused ? 1000 : (isBreathingIn ? 2000 : 1000)

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      {/* 方案 D: 简化为 3 层（最外层 + 主圆圈 + 中心点） */}
      
      {/* 第 1 层: 最外层光晕（简化） */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 173, 86, 0.12) 0%, transparent 80%)',
          filter: 'blur(15px)',  // 减少模糊强度
          transform: 'translate(-50%, -50%)',
          borderRadius: organicRadius,  // 有机圆角
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.15 : 0.95) : 1,  // 减小缩放幅度
          opacity: isActive ? 0.4 : 0.2,  // 简化透明度
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration: 1, ease: 'easeInOut' },
        }}
      />
      
      {/* 第 2 层: 主圆圈（核心呼吸动画) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 173, 86, 0.4) 0%, rgba(168, 213, 186, 0.2) 100%)',
          transform: 'translate(-50%, -50%)',
          borderRadius: organicRadius,  // 有机圆角
          boxShadow: '0 0 20px rgba(95, 173, 86, 0.3)',
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.12 : 0.94) : 1,  // 优化缩放
          opacity: isActive ? [0.7, 0.9, 0.7] : [0.6, 0.8, 0.6],  // 新增透明度动画
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration, ease: currentEasing },
        }}
      />
      
      {/* 第 3 层: 中心点（焦点， 增强) */}
      <motion.div
        className="rounded-full"
        style={{
          width: 40,
          height: 40,
          background: 'radial-gradient(circle at 50% 50%, rgba(168, 213, 186, 0.9) 0%, rgba(95, 173, 86, 0.5) 100%)',
          boxShadow: '0 0 25px rgba(168, 213, 186, 0.7)',  // 增强发光
        }}
        animate={{
          scale: isActive ? (isBreathingIn ? 1.3 : 0.85) : 1,  // 优化缩放
          opacity: isActive ? 1 : 0.8,
        }}
        transition={{
          scale: { duration, ease: currentEasing },
          opacity: { duration: 0.3, ease: 'easeInOut' },
        }}
      />
      
      {/* 呼吸状态指示文字 */}
      {isActive && (
        <motion.div
          className="absolute -bottom-8 text-sm text-zen-accent/70 font-light tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isPaused ? '暂停' : (isBreathingIn ? '吸气' : '呼气')}
        </motion.div>
      )}
    </div>
  )
}
