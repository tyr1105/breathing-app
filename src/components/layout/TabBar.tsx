import { motion } from 'framer-motion'

export type TabType = 'home' | 'stats' | 'achievements' | 'settings'

interface TabBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onStartTraining: () => void
}

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'stats', label: '数据', icon: '📊' },
  { id: 'achievements', label: '成就', icon: '🏆' },
  { id: 'settings', label: '设置', icon: '⚙️' },
]

export function TabBar({ activeTab, onTabChange, onStartTraining }: TabBarProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 15, 26, 0.98)',
        borderTop: '1px solid rgba(125, 212, 168, 0.1)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex justify-around items-end pt-2 px-2 relative">
        {/* 左侧两个 Tab */}
        <TabItem 
          tab={tabs[0]} 
          isActive={activeTab === tabs[0].id} 
          onClick={() => onTabChange(tabs[0].id)} 
        />
        <TabItem 
          tab={tabs[1]} 
          isActive={activeTab === tabs[1].id} 
          onClick={() => onTabChange(tabs[1].id)} 
        />
        
        {/* 中间训练按钮 */}
        <div className="relative -top-5">
          <motion.button
            onClick={onStartTraining}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{
              background: 'linear-gradient(135deg, #7dd4a8 0%, #5bc48e 100%)',
              boxShadow: '0 4px 20px rgba(125, 212, 168, 0.4), 0 0 40px rgba(125, 212, 168, 0.2)',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 6px 30px rgba(125, 212, 168, 0.5), 0 0 50px rgba(125, 212, 168, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🌬️</span>
          </motion.button>
          <p 
            className="text-center text-[10px] mt-1"
            style={{ color: '#7dd4a8' }}
          >
            训练
          </p>
        </div>
        
        {/* 右侧两个 Tab */}
        <TabItem 
          tab={tabs[2]} 
          isActive={activeTab === tabs[2].id} 
          onClick={() => onTabChange(tabs[2].id)} 
        />
        <TabItem 
          tab={tabs[3]} 
          isActive={activeTab === tabs[3].id} 
          onClick={() => onTabChange(tabs[3].id)} 
        />
      </div>
    </div>
  )
}

function TabItem({ 
  tab, 
  isActive, 
  onClick 
}: { 
  tab: { id: TabType; label: string; icon: string }
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-2 px-3"
      whileTap={{ scale: 0.95 }}
    >
      <span 
        className="text-xl transition-all duration-200"
        style={{ 
          opacity: isActive ? 1 : 0.45,
          filter: isActive ? 'none' : 'grayscale(0.5)',
        }}
      >
        {tab.icon}
      </span>
      <span 
        className="text-[10px] transition-all duration-200"
        style={{ 
          color: isActive ? '#7dd4a8' : '#9ca3af',
          opacity: isActive ? 1 : 0.6,
        }}
      >
        {tab.label}
      </span>
    </motion.button>
  )
}
