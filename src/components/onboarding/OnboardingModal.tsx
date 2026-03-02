import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingModalProps {
  onComplete: () => void
}

const steps = [
  {
    icon: '🌬️',
    title: '冰人呼吸法',
    description: '一种强大的呼吸技巧，可以帮助你提升能量、减轻压力、增强免疫力。',
  },
  {
    icon: '🫁',
    title: '如何练习',
    description: '30次深呼吸后憋气，恢复呼吸15秒，重复3轮。全程放松，专注呼吸。',
  },
  {
    icon: '⚠️',
    title: '安全第一',
    description: '请勿在水中、驾驶时或站立时练习。如有不适请立即停止。',
  },
  {
    icon: '🎯',
    title: '开始训练',
    description: '跟随屏幕提示呼吸，闭眼体验效果更佳。准备好开始了吗？',
  },
]

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const skipAll = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
      <div className="max-w-sm w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            <div className="text-7xl mb-6">{steps[currentStep].icon}</div>
            <h2 className="text-2xl font-light text-zen-text mb-3">
              {steps[currentStep].title}
            </h2>
            <p className="text-zen-text-dim leading-relaxed">
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 进度点 */}
        <div className="flex justify-center gap-2 mt-10 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep 
                  ? 'bg-zen-accent w-6' 
                  : index < currentStep 
                    ? 'bg-zen-accent/50' 
                    : 'bg-zen-accent/20'
              }`}
            />
          ))}
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          {currentStep < steps.length - 1 && (
            <button
              onClick={skipAll}
              className="flex-1 py-3 px-6 text-zen-text-dim hover:text-zen-text transition-colors"
            >
              跳过
            </button>
          )}
          <button
            onClick={nextStep}
            className="flex-1 py-3 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                       text-zen-accent rounded-2xl transition-all font-medium"
          >
            {currentStep < steps.length - 1 ? '下一步' : '开始训练'}
          </button>
        </div>
      </div>
    </div>
  )
}
