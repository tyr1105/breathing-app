import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TabBar, type TabType } from './TabBar'
import { HomePage } from '../pages/HomePage'
import { StatsPage } from '../pages/StatsPage'
import { AchievementsPage } from '../achievements/AchievementsPage'
import { SettingsModal } from '../settings/SettingsModal'
import { settingsManager } from '../../utils/storage'
import type { Settings } from '../../utils/storage'

interface MainLayoutProps {
  children: React.ReactNode // 训练页面
  isTraining: boolean // 是否在训练中（隐藏 Tab）
  onStartTraining: () => void
}

export function MainLayout({ children, isTraining, onStartTraining }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [settings, setSettings] = useState<Settings>(settingsManager.get())

  // 训练中显示训练页面，否则显示 Tab 内容
  const showTraining = isTraining

  return (
    <div className="min-h-screen bg-zen-bg flex flex-col">
      {/* 主内容区 */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {showTraining ? (
            // 训练页面（全屏）
            <motion.div
              key="training"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {children}
            </motion.div>
          ) : (
            // Tab 内容
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="pb-20" // 为 TabBar 留空间
            >
              {activeTab === 'home' && (
                <HomePage onStartTraining={onStartTraining} />
              )}
              {activeTab === 'stats' && <StatsPage />}
              {activeTab === 'achievements' && (
                <AchievementsPage 
                  onBack={() => setActiveTab('home')} 
                  unlockedIds={[]} 
                />
              )}
              {activeTab === 'settings' && (
                <SettingsModal
                  settings={settings}
                  onClose={() => setActiveTab('home')}
                  onSave={(newSettings) => {
                    setSettings(newSettings)
                    setActiveTab('home')
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TabBar（训练时隐藏） */}
      <AnimatePresence>
        {!isTraining && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onStartTraining={onStartTraining}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
