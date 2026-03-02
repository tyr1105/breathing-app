import { useState, useEffect, useCallback } from 'react'
import { BreathingCircle } from './components/breathing/BreathingCircle'
import { SafetyModal } from './components/safety/SafetyModal'
import { Timer } from './components/breathing/Timer'
import { TrainingSummary } from './components/summary/TrainingSummary'

type TrainingPhase = 
  | 'idle'
  | 'safety-check'
  | 'breathing'
  | 'hold'
  | 'recovery'
  | 'complete'

function App() {
  const [phase, setPhase] = useState<TrainingPhase>('idle')
  const [round, setRound] = useState(1)
  const [breathCount, setBreathCount] = useState(0)
  const [holdTime, setHoldTime] = useState(0)
  const [recoveryTime, setRecoveryTime] = useState(15)
  const [roundHoldTimes, setRoundHoldTimes] = useState<number[]>([])
  const [breathText, setBreathText] = useState<'吸气' | '呼气'>('吸气')

  const totalRounds = 3
  const breathsPerRound = 30

  // 呼吸循环
  useEffect(() => {
    if (phase !== 'breathing') return

    // 吸气阶段 - 2秒
    setBreathText('吸气')
    const inhaleTimer = setTimeout(() => {
      setBreathText('呼气')
      
      // 呼气阶段 - 1秒
      const exhaleTimer = setTimeout(() => {
        setBreathCount(prev => {
          const newCount = prev + 1
          if (newCount >= breathsPerRound) {
            setPhase('hold')
            setHoldTime(0)
          }
          return newCount
        })
      }, 1000)

      return () => clearTimeout(exhaleTimer)
    }, 2000)

    return () => clearTimeout(inhaleTimer)
  }, [phase, breathCount, breathsPerRound])

  // 憋气计时器
  useEffect(() => {
    if (phase !== 'hold') return
    const timer = setInterval(() => setHoldTime(prev => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [phase])

  // 恢复呼吸计时器
  useEffect(() => {
    if (phase !== 'recovery') return
    const timer = setInterval(() => {
      setRecoveryTime(prev => {
        if (prev <= 1) {
          if (round >= totalRounds) {
            setPhase('complete')
          } else {
            setPhase('breathing')
            setRound(r => r + 1)
            setBreathCount(0)
            setBreathText('吸气')
          }
          return 15
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, round, totalRounds])

  // 结束憋气
  const endHold = useCallback(() => {
    setRoundHoldTimes(prev => [...prev, holdTime])
    setPhase('recovery')
    setRecoveryTime(15)
  }, [holdTime])

  // 重置
  const reset = useCallback(() => {
    setPhase('idle')
    setRound(1)
    setBreathCount(0)
    setHoldTime(0)
    setRecoveryTime(15)
    setRoundHoldTimes([])
    setBreathText('吸气')
  }, [])

  // 空闲状态
  if (phase === 'idle') {
    return (
      <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-light text-zen-text mb-2">
            冰人呼吸法
          </h1>
          <p className="text-zen-text-dim mb-8">
            Wim Hof Method
          </p>
          
          <BreathingCircle isBreathingIn={true} isActive={false} />
          
          <button
            onClick={() => setPhase('safety-check')}
            className="mt-8 py-3 px-8 bg-zen-accent/20 hover:bg-zen-accent/30 
                       text-zen-accent rounded-xl transition-colors font-medium"
          >
            开始训练
          </button>
          
          <p className="mt-6 text-sm text-zen-text-dim">
            {totalRounds}轮训练 × {breathsPerRound}次呼吸
          </p>
        </div>
      </div>
    )
  }

  // 安全提示
  if (phase === 'safety-check') {
    return (
      <div className="min-h-screen bg-zen-bg flex items-center justify-center">
        <SafetyModal onConfirm={() => setPhase('breathing')} />
      </div>
    )
  }

  // 呼吸训练
  if (phase === 'breathing') {
    return (
      <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-sm text-zen-text-dim mb-2">
            第 {round}/{totalRounds} 轮
          </div>
          
          <div className="text-3xl text-zen-text mb-4">
            {breathText}
          </div>
          
          <BreathingCircle isBreathingIn={breathText === '吸气'} isActive={true} />
          
          <div className="mt-6 text-zen-accent text-xl">
            {breathCount} / {breathsPerRound}
          </div>
        </div>
      </div>
    )
  }

  // 憋气阶段
  if (phase === 'hold') {
    return (
      <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-sm text-zen-text-dim mb-2">
            第 {round}/{totalRounds} 轮
          </div>
          
          <div className="text-3xl text-zen-text mb-4">
            憋气
          </div>
          
          <BreathingCircle isBreathingIn={false} isActive={false} />
          
          <div className="mt-6">
            <Timer time={holdTime} label="憋气时长" />
          </div>
          
          <button
            onClick={endHold}
            className="mt-8 py-3 px-8 bg-zen-gold/20 hover:bg-zen-gold/30 
                       text-zen-gold rounded-xl transition-colors font-medium"
          >
            结束憋气
          </button>
        </div>
      </div>
    )
  }

  // 恢复呼吸
  if (phase === 'recovery') {
    return (
      <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-3xl text-zen-text mb-4">
            深吸一口气，憋住
          </div>
          
          <BreathingCircle isBreathingIn={true} isActive={true} />
          
          <div className="mt-6">
            <Timer time={recoveryTime} label="恢复呼吸" />
          </div>
        </div>
      </div>
    )
  }

  // 训练完成
  if (phase === 'complete') {
    return (
      <TrainingSummary 
        roundHoldTimes={roundHoldTimes}
        totalRounds={totalRounds}
        onRestart={reset}
      />
    )
  }

  return null
}

export default App
