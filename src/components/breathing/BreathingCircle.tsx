import { motion } from 'framer-motion'

interface BreathingCircleProps {
  isBreathingIn: boolean
  isActive: boolean
}

export function BreathingCircle({ isBreathingIn, isActive }: BreathingCircleProps) {
  return (
    <div className="flex items-center justify-center">
      {/* 外圈光晕 */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-zen-accent/5"
        animate={{
          scale: isActive ? (isBreathingIn ? 1.8 : 1.2) : 1,
          opacity: isActive ? 0.3 : 0.1,
        }}
        transition={{
          duration: isBreathingIn ? 2 : 1,
          ease: 'easeInOut',
        }}
      />
      
      {/* 中圈 */}
      <motion.div
        className="absolute w-36 h-36 rounded-full bg-zen-accent/10"
        animate={{
          scale: isActive ? (isBreathingIn ? 1.6 : 1.1) : 1,
          opacity: isActive ? 0.5 : 0.2,
        }}
        transition={{
          duration: isBreathingIn ? 2 : 1,
          ease: 'easeInOut',
        }}
      />
      
      {/* 主圆圈 */}
      <motion.div
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-zen-accent/30 to-zen-accent-dim/10 border-2 border-zen-accent/30"
        animate={{
          scale: isActive ? (isBreathingIn ? 1.5 : 1) : 1,
          opacity: isActive ? 1 : 0.6,
        }}
        transition={{
          duration: isBreathingIn ? 2 : 1,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
