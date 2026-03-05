import { motion } from 'framer-motion'
import { Snowflake } from 'lucide-react'
import { APP_VERSION, BUILD_DATE, CHANGELOG } from '../../utils/version'

interface AboutPageProps {
  onBack: () => void
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="fullscreen-page-top bg-zen-bg p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-zen-text-dim hover:text-zen-text text-lg">← 返回</button>
          <h2 className="text-xl font-semibold text-zen-text">关于</h2>
          <div className="w-12" />
        </div>

        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex justify-center mb-4">
            <Snowflake className="w-16 h-16 text-zen-accent" />
          </div>
          <h1 className="text-2xl font-light text-zen-text mb-2">冰人呼吸法</h1>
          <p className="text-zen-text-dim text-sm">Wim Hof Method Training App</p>
          <p className="text-zen-text-dim text-xs mt-2">版本 {APP_VERSION} | {BUILD_DATE}</p>
        </motion.div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zen-bg-light rounded-2xl p-3 text-center border border-zen-accent/10">
            <div className="text-xl font-light text-zen-accent">21</div>
            <div className="text-xs text-zen-text-dim">版本迭代</div>
          </div>
          <div className="bg-zen-bg-light rounded-2xl p-3 text-center border border-zen-accent/10">
            <div className="text-xl font-light text-zen-accent">11</div>
            <div className="text-xs text-zen-text-dim">成就徽章</div>
          </div>
          <div className="bg-zen-bg-light rounded-2xl p-3 text-center border border-zen-accent/10">
            <div className="text-xl font-light text-zen-accent">100%</div>
            <div className="text-xs text-zen-text-dim">免费开源</div>
          </div>
        </div>

        {/* 更新日志 */}
        <div className="mb-6">
          <h3 className="text-zen-text font-medium mb-4">更新日志</h3>
          <div className="space-y-3">
            {CHANGELOG.slice(0, 3).map((log, index) => (
              <div key={index} className="bg-zen-bg-light rounded-xl p-4 border border-zen-accent/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zen-accent text-sm font-medium">v{log.version}</span>
                  <span className="text-zen-text-dim text-xs">{log.date}</span>
                </div>
                <ul className="space-y-1">
                  {log.changes.map((change, i) => (
                    <li key={i} className="text-zen-text-dim text-sm flex items-start gap-2">
                      <span className="text-zen-accent">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 链接 */}
        <div className="space-y-3">
          <a
            href="https://github.com/tyr1105/breathing-app"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-zen-bg-light hover:bg-zen-bg-light/80 
                       text-zen-text rounded-xl transition-colors text-sm text-center
                       border border-zen-accent/10"
          >
            GitHub 仓库 →
          </a>
          <a
            href="https://www.wimhofmethod.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-zen-bg-light hover:bg-zen-bg-light/80 
                       text-zen-text rounded-xl transition-colors text-sm text-center
                       border border-zen-accent/10"
          >
            Wim Hof 官网 →
          </a>
        </div>

        {/* 版权 */}
        <p className="text-center text-zen-text-dim text-xs mt-8">
          Made with ❤️ by 乔乔 | MIT License
        </p>
      </div>
    </div>
  )
}
