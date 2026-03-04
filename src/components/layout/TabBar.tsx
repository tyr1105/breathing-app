import { motion } from 'framer-motion'

export type TabType = 'home' | 'stats' | 'achievements' | 'settings'

interface TabBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onStartTraining: () => void
}

// SVG 图标组件类型
interface IconProps {
  className?: string
  style?: React.CSSProperties
}

// SVG 图标组件
const HomeIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const ChartIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const TrophyIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const CogIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const BreathIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity={0.3} />
  </svg>
)

const tabs: { id: TabType; label: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { id: 'home', label: '首页', Icon: HomeIcon },
  { id: 'stats', label: '数据', Icon: ChartIcon },
  { id: 'achievements', label: '成就', Icon: TrophyIcon },
  { id: 'settings', label: '设置', Icon: CogIcon },
]

export function TabBar({ activeTab, onTabChange, onStartTraining }: TabBarProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="主导航"
      style={{
        background: 'rgba(10, 31, 10, 0.98)',
        borderTop: '1px solid rgba(95, 173, 86, 0.1)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <ul className="flex justify-around items-end pt-2 px-2 relative" role="tablist">
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
        
        {/* 中间训练按钮 - 突出显示 */}
        <li className="relative -top-5 list-none">
          <motion.button
            onClick={onStartTraining}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #5FAD56 0%, #4A9A48 100%)',
              boxShadow: '0 4px 20px rgba(95, 173, 86, 0.4), 0 0 40px rgba(95, 173, 86, 0.2)',
              minWidth: '64px',
              minHeight: '64px',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 6px 30px rgba(95, 173, 86, 0.5), 0 0 50px rgba(95, 173, 86, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="开始呼吸训练"
          >
            <BreathIcon className="w-8 h-8 text-white" />
          </motion.button>
          <p 
            className="text-center text-[10px] mt-1"
            style={{ color: '#5FAD56' }}
            aria-hidden="true"
          >
            训练
          </p>
        </li>
        
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
      </ul>
    </nav>
  )
}

function TabItem({ 
  tab, 
  isActive, 
  onClick 
}: { 
  tab: { id: TabType; label: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <li className="list-none">
      <motion.button
        onClick={onClick}
        className="flex flex-col items-center gap-1 py-2 px-3"
        style={{
          minWidth: '44px',
          minHeight: '44px',
        }}
        whileTap={{ scale: 0.95 }}
        role="tab"
        aria-selected={isActive}
        aria-label={tab.label}
        aria-controls={`${tab.id}-panel`}
      >
        <tab.Icon 
          className="w-6 h-6 transition-all duration-200"
          style={{ 
            color: isActive ? '#5FAD56' : '#9ca3af',
            opacity: isActive ? 1 : 0.5,
          }}
          aria-hidden="true"
        />
        <span 
          className="text-[10px] transition-all duration-200"
          style={{ 
            color: isActive ? '#5FAD56' : '#9ca3af',
            opacity: isActive ? 1 : 0.6,
          }}
        >
          {tab.label}
        </span>
      </motion.button>
    </li>
  )
}
