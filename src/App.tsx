import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { StatusBar, Style } from '@capacitor/status-bar'
import { App as CapApp } from '@capacitor/app'
import { BreathingCircle } from './components/breathing/BreathingCircle'
import { SafetyModal } from './components/safety/SafetyModal'
import { Timer } from './components/breathing/Timer'
import { TrainingSummary } from './components/summary/TrainingSummary'
import { SettingsModal } from './components/settings/SettingsModal'
import { HistoryPage } from './components/history/HistoryPage'
import { AchievementsPage } from './components/achievements/AchievementsPage'
import { TabBar, type TabType } from './components/layout/TabBar'
import { audioManager, vibrate } from './utils/audio'
import { settingsManager, historyManager, statsManager } from './utils/storage'
import type { Settings } from './utils/storage'

type TrainingPhase = 
  | 'idle'
  | 'safety-check'
  | 'breathing'
  | 'hold'
  | 'recovery'
  | 'complete'
  | 'paused'

type Page = 'main' | 'settings' | 'history'

// 获取时间问候语
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '早安'
  if (hour >= 12 && hour < 18) return '午安'
  return '晚安'
}

// 格式化时间
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function App() {
  const [page, setPage] = useState<Page>('main')
  const [phase, setPhase] = useState<TrainingPhase>('idle')
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [round, setRound] = useState(1)
  const [breathCount, setBreathCount] = useState(0)
  const [holdTime, setHoldTime] = useState(0)
  const [recoveryTime, setRecoveryTime] = useState(15)
  const [roundHoldTimes, setRoundHoldTimes] = useState<number[]>([])
  const [breathText, setBreathText] = useState<'吸气' | '呼气'>('吸气')
  const [settings, setSettings] = useState<Settings>(settingsManager.get())
  const [pausedPhase, setPausedPhase] = useState<TrainingPhase | null>(null)

  const { totalRounds, breathsPerRound, recoveryTime: settingRecoveryTime, soundEnabled, vibrationEnabled, skipSafetyWarning } = settings

  // 状态栏适配 - 透明状态栏 + safe-area 保护
  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        // 让内容延伸到状态栏下方，但通过 safe-area 保护内容不被遮挡
        await StatusBar.setOverlaysWebView({ overlay: true })
        // 设置深色状态栏（浅色文字）
        await StatusBar.setStyle({ style: Style.Dark })
        // 状态栏背景色（透明时会被 overlay 忽略，但保留作为 fallback）
        await StatusBar.setBackgroundColor({ color: '#0a0f1a' })
      } catch {
        // Web 环境忽略错误
      }
    }
    setupStatusBar()
  }, [])

  // Android 返回按钮适配
  useEffect(() => {
    let listener: { remove: () => void } | null = null
    
    const setupBackButton = async () => {
      try {
        listener = await CapApp.addListener('backButton', handleBackButton)
      } catch {
        // Web 环境忽略错误
      }
    }
    
    const handleBackButton = async () => {
      const currentPhase = phase
      const currentPage = page
      
      // 如果在设置或历史页面，返回主页
      if (currentPage === 'settings' || currentPage === 'history') {
        setPage('main')
        return
      }
      
      // 根据 phase 做不同处理
      switch (currentPhase) {
        case 'paused':
          // 暂停状态，显示退出确认
          if (confirm('确定要退出训练吗？当前进度将不会保存。')) {
            setPhase('idle')
            setRound(1)
            setBreathCount(0)
            setHoldTime(0)
            setRecoveryTime(settingRecoveryTime)
            setRoundHoldTimes([])
            setBreathText('吸气')
            setPausedPhase(null)
          }
          return
          
        case 'safety-check':
          // 安全提示页面，返回空闲
          setPhase('idle')
          return
          
        case 'complete':
          // 完成页面，重置到空闲
          setPhase('idle')
          setRound(1)
          setBreathCount(0)
          setHoldTime(0)
          setRecoveryTime(settingRecoveryTime)
          setRoundHoldTimes([])
          setBreathText('吸气')
          setPausedPhase(null)
          return
          
        case 'breathing':
        case 'hold':
        case 'recovery':
          // 训练中，切换到暂停
          setPausedPhase(currentPhase)
          setPhase('paused')
          return
          
        case 'idle':
        default:
          // 空闲状态，退出应用
          await CapApp.exitApp()
          return
      }
    }
    
    setupBackButton()
    
    return () => {
      listener?.remove()
    }
  }, [page, phase, settingRecoveryTime])

  // 辅助函数
  const playSound = useCallback((type: 'inhale' | 'exhale' | 'holdStart' | 'recoveryTick' | 'complete') => {
    if (!soundEnabled) return
    switch (type) {
      case 'inhale': audioManager.playInhale(); break
      case 'exhale': audioManager.playExhale(); break
      case 'holdStart': audioManager.playHoldStart(); break
      case 'recoveryTick': audioManager.playRecoveryTick(); break
      case 'complete': audioManager.playComplete(); break
    }
  }, [soundEnabled])

  const doVibrate = useCallback((type: 'short' | 'long' | 'double') => {
    if (!vibrationEnabled) return
    switch (type) {
      case 'short': vibrate.short(); break
      case 'long': vibrate.long(); break
      case 'double': vibrate.double(); break
    }
  }, [vibrationEnabled])

  // 暂停/恢复
  const togglePause = useCallback(() => {
    if (phase === 'paused' && pausedPhase) {
      setPhase(pausedPhase)
      setPausedPhase(null)
    } else if (phase !== 'idle' && phase !== 'complete' && phase !== 'safety-check') {
      setPausedPhase(phase)
      setPhase('paused')
    }
  }, [phase, pausedPhase])

  // 呼吸循环
  useEffect(() => {
    if (phase !== 'breathing') return

    setBreathText('吸气')
    playSound('inhale')
    doVibrate('short')

    const inhaleTimer = setTimeout(() => {
      if (phase !== 'breathing') return
      setBreathText('呼气')
      playSound('exhale')
      doVibrate('short')
      
      const exhaleTimer = setTimeout(() => {
        if (phase !== 'breathing') return
        setBreathCount(prev => {
          const newCount = prev + 1
          if (newCount >= breathsPerRound) {
            setPhase('hold')
            setHoldTime(0)
            playSound('holdStart')
            doVibrate('long')
          }
          return newCount
        })
      }, 1000)

      return () => clearTimeout(exhaleTimer)
    }, 2000)

    return () => clearTimeout(inhaleTimer)
  }, [phase, breathCount, breathsPerRound, playSound, doVibrate])

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
        playSound('recoveryTick')
        if (prev <= 1) {
          if (round >= totalRounds) {
            playSound('complete')
            doVibrate('double')
            
            historyManager.add({
              rounds: totalRounds,
              breathsPerRound,
              holdTimes: roundHoldTimes,
              totalHoldTime: roundHoldTimes.reduce((a, b) => a + b, 0),
            })
            
            statsManager.updateTraining(roundHoldTimes.reduce((a, b) => a + b, 0))
            const maxHold = Math.max(...roundHoldTimes)
            statsManager.updatePersonalBest(maxHold)
            
            setPhase('complete')
          } else {
            setPhase('breathing')
            setRound(r => r + 1)
            setBreathCount(0)
            setBreathText('吸气')
          }
          return settingRecoveryTime
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, round, totalRounds, settingRecoveryTime, breathsPerRound, roundHoldTimes, playSound, doVibrate])

  // 开始训练
  const startTraining = useCallback(() => {
    if (skipSafetyWarning) {
      setPhase('breathing')
    } else {
      setPhase('safety-check')
    }
  }, [skipSafetyWarning])

  // 结束憋气
  const endHold = useCallback(() => {
    setRoundHoldTimes(prev => [...prev, holdTime])
    setPhase('recovery')
    setRecoveryTime(settingRecoveryTime)
  }, [holdTime, settingRecoveryTime])

  // 退出训练
  const exitTraining = useCallback(() => {
    if (confirm('确定要退出训练吗？当前进度将不会保存。')) {
      setPhase('idle')
      setRound(1)
      setBreathCount(0)
      setHoldTime(0)
      setRecoveryTime(settingRecoveryTime)
      setRoundHoldTimes([])
      setBreathText('吸气')
      setPausedPhase(null)
    }
  }, [settingRecoveryTime])

  // 重置
  const reset = useCallback(() => {
    setPhase('idle')
    setRound(1)
    setBreathCount(0)
    setHoldTime(0)
    setRecoveryTime(settingRecoveryTime)
    setRoundHoldTimes([])
    setBreathText('吸气')
    setPausedPhase(null)
  }, [settingRecoveryTime])

  // 更新设置
  const handleSaveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings)
    setRecoveryTime(newSettings.recoveryTime)
  }, [])

  const stats = statsManager.get()

  // 获取最近训练记录
  const recentSessions = useMemo(() => {
    const history = historyManager.getAll()
    return history.slice(0, 2)
  }, [phase])

  // 空闲状态 - 使用 Tab 导航
  if (phase === 'idle') {
    return (
      <div className="min-h-screen bg-zen-bg flex flex-col">
        {/* 主内容区 */}
        <div className="flex-1 pb-20">
          {/* 首页 Tab */}
          {activeTab === 'home' && (
            <div className="fullscreen-page p-4">
              <div className="text-center animate-fade-in w-full max-w-md mx-auto">
                {/* 顶部状态栏 */}
                <div className="flex justify-between items-center mb-6" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                  {stats.consecutiveDays > 0 && (
                    <motion.div 
                      className="bg-zen-accent/10 px-3 py-1.5 rounded-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span className="text-zen-accent text-xs">🔥 {stats.consecutiveDays}天</span>
                    </motion.div>
                  )}
                  <div className="flex-1" />
                </div>
                
                {/* 个性化问候 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2"
                >
                  <p className="text-zen-text-dim text-sm">{getGreeting()}</p>
                </motion.div>
                
                {/* 主标题 */}
                <motion.h1 
                  className="text-3xl font-light text-zen-text mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  冰人呼吸法
                </motion.h1>
                <motion.p 
                  className="text-zen-text-dim text-xs mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Wim Hof Method
                </motion.p>
                
                {/* 呼吸圆圈 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <BreathingCircle isBreathingIn={true} isActive={false} />
                </motion.div>
                
                {/* 开始按钮 */}
                <motion.button
                  onClick={startTraining}
                  className="mt-8 py-4 px-12 bg-zen-accent/20 hover:bg-zen-accent/30 
                             text-zen-accent rounded-2xl transition-all font-medium text-lg
                             active:scale-95"
                  style={{
                    boxShadow: '0 4px 30px rgba(125, 212, 168, 0.2)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ boxShadow: '0 6px 40px rgba(125, 212, 168, 0.3)' }}
                  whileTap={{ scale: 0.95, boxShadow: '0 2px 20px rgba(125, 212, 168, 0.15)' }}
                >
                  开始训练
                </motion.button>
                
                <motion.p 
                  className="mt-4 text-xs text-zen-text-dim"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {totalRounds}轮 × {breathsPerRound}次呼吸
                </motion.p>

                {/* 最近训练 */}
                {recentSessions.length > 0 && (
                  <motion.div
                    className="mt-8 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p className="text-xs text-zen-text-dim mb-2 px-1">最近训练</p>
                    <div className="space-y-2">
                      {recentSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          className="bg-zen-bg-light/50 rounded-xl p-3 border border-zen-accent/5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-zen-text text-sm">{formatTime(new Date(session.date))}</span>
                              <span className="text-zen-text-dim text-xs ml-2">{session.rounds}轮</span>
                            </div>
                            <div className="text-zen-accent text-xs">
                              {Math.floor(session.totalHoldTime / 60)}:{String(session.totalHoldTime % 60).padStart(2, '0')} 憋气
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* 数据 Tab */}
          {activeTab === 'stats' && (
            <HistoryPage onBack={() => setActiveTab('home')} />
          )}

          {/* 成就 Tab */}
          {activeTab === 'achievements' && (
            <AchievementsPage 
              onBack={() => setActiveTab('home')} 
              unlockedIds={[]} 
            />
          )}

          {/* 设置 Tab */}
          {activeTab === 'settings' && (
            <SettingsModal
              settings={settings}
              onSave={handleSaveSettings}
              onClose={() => setActiveTab('home')}
            />
          )}
        </div>

        {/* TabBar */}
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onStartTraining={startTraining}
        />
      </div>
    )
  }

  // 安全提示
  if (phase === 'safety-check') {
    return (
      <div className="fullscreen-page bg-zen-bg">
        <SafetyModal 
          onConfirm={() => setPhase('breathing')} 
          onSkip={() => {
            settingsManager.save({ skipSafetyWarning: true })
            setSettings(prev => ({ ...prev, skipSafetyWarning: true }))
            setPhase('breathing')
          }}
        />
      </div>
    )
  }

  // 暂停状态
  if (phase === 'paused') {
    return (
      <div className="fullscreen-page bg-zen-bg p-4">
        <div className="text-center">
          <div className="text-6xl mb-6">⏸️</div>
          <div className="text-3xl font-light text-zen-text mb-2">训练已暂停</div>
          <p className="text-zen-text-dim mb-8">点击继续恢复训练</p>
          
          <button
            onClick={togglePause}
            className="py-4 px-10 bg-zen-accent/20 hover:bg-zen-accent/30 
                       text-zen-accent rounded-2xl transition-all font-medium text-lg"
          >
            继续训练
          </button>
          
          <button
            onClick={exitTraining}
            className="block mx-auto mt-6 text-zen-text-dim hover:text-zen-text"
          >
            退出训练
          </button>
        </div>
      </div>
    )
  }

  // 呼吸训练
  if (phase === 'breathing') {
    const progress = (breathCount / breathsPerRound) * 100
    const roundProgress = ((round - 1) / totalRounds) * 100 + (progress / totalRounds)
    
    return (
      <div className="fullscreen-page bg-zen-bg p-4">
        {/* 顶部进度条 */}
        <div className="fixed left-0 right-0 h-0.5 bg-zen-bg-light/50" style={{ top: 'env(safe-area-inset-top, 0)' }}>
          <motion.div 
            className="h-full"
            style={{ 
              width: `${roundProgress}%`,
              background: 'linear-gradient(90deg, rgba(125, 212, 168, 0.4) 0%, rgba(125, 212, 168, 0.8) 100%)'
            }}
          />
        </div>

        {/* 控制按钮 */}
        <div className="top-bar flex justify-between items-center">
          <div className="text-zen-text-dim text-xs font-light">第 {round}/{totalRounds} 轮</div>
          <div className="flex gap-3">
            <button 
              onClick={togglePause} 
              className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 rounded-lg hover:bg-zen-accent/10 transition-colors"
            >
              ⏸️
            </button>
            <button 
              onClick={exitTraining} 
              className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 rounded-lg hover:bg-zen-accent/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="text-center flex-1 flex flex-col justify-center">
          {/* 呼吸状态文字 - 更大更醒目 */}
          <motion.div 
            key={breathText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extralight text-zen-text mb-8 tracking-wider"
          >
            {breathText}
          </motion.div>
          
          <BreathingCircle isBreathingIn={breathText === '吸气'} isActive={true} />
          
          {/* 进度显示 - 更简洁 */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <span className="text-3xl font-light text-zen-accent">{breathCount}</span>
            <span className="text-zen-text-dim text-lg">/</span>
            <span className="text-zen-text-dim text-lg">{breathsPerRound}</span>
          </div>
          
          {/* 进度条 - 更圆润 */}
          <div className="mt-4 w-48 mx-auto">
            <div className="h-1.5 bg-zen-bg-light/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, rgba(125, 212, 168, 0.4) 0%, rgba(125, 212, 168, 0.7) 100%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 憋气阶段
  if (phase === 'hold') {
    return (
      <div className="fullscreen-page bg-zen-bg p-4">
        <div className="top-bar flex justify-between items-center">
          <div className="text-zen-text-dim text-xs font-light">第 {round}/{totalRounds} 轮</div>
          <div className="flex gap-3">
            <button onClick={togglePause} className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 rounded-lg hover:bg-zen-gold/10 transition-colors">⏸️</button>
            <button onClick={exitTraining} className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 rounded-lg hover:bg-zen-gold/10 transition-colors">✕</button>
          </div>
        </div>

        <div className="text-center flex-1 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-extralight text-zen-text mb-6 tracking-wider"
          >
            憋气
          </motion.div>
          
          <BreathingCircle isBreathingIn={false} isActive={false} />
          
          <div className="mt-8">
            <Timer time={holdTime} label="" />
          </div>
          
          <motion.button 
            onClick={endHold} 
            className="mt-10 py-4 px-10 text-zen-gold rounded-2xl font-light text-lg"
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.15)'
            }}
            whileHover={{ 
              background: 'rgba(251, 191, 36, 0.15)',
              boxShadow: '0 0 40px rgba(251, 191, 36, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            结束憋气
          </motion.button>
          <p className="mt-3 text-xs text-zen-text-dim">感觉不舒服时随时结束</p>
        </div>
      </div>
    )
  }

  // 恢复呼吸
  if (phase === 'recovery') {
    return (
      <div className="fullscreen-page bg-zen-bg p-4">
        <div className="top-bar flex justify-between items-center">
          <div className="text-zen-text-dim text-xs font-light">第 {round}/{totalRounds} 轮</div>
          <div className="flex gap-3">
            <button onClick={togglePause} className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 rounded-lg hover:bg-zen-accent/10 transition-colors">⏸️</button>
            <button onClick={exitTraining} className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 rounded-lg hover:bg-zen-accent/10 transition-colors">✕</button>
          </div>
        </div>

        <div className="text-center flex-1 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extralight text-zen-text mb-4"
          >
            深吸一口气
          </motion.div>
          <div className="text-xl text-zen-text-dim mb-8">然后憋住 {recoveryTime} 秒</div>
          <BreathingCircle isBreathingIn={true} isActive={true} />
          <div className="mt-8">
            <Timer time={recoveryTime} label="恢复呼吸" />
          </div>
        </div>
      </div>
    )
  }

  // 训练完成
  if (phase === 'complete') {
    return <TrainingSummary roundHoldTimes={roundHoldTimes} totalRounds={totalRounds} onRestart={reset} />
  }

  return null
}

export default App
