import { useState, useCallback } from 'react'
import type { Settings } from '../../utils/storage'

interface SettingsModalProps {
  settings: Settings
  onSave: (settings: Settings) => void
  onClose: () => void
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  // 使用本地状态实现实时更新
  const [localSettings, setLocalSettings] = useState<Settings>(settings)

  // 实时更新函数
  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSave(newSettings) // 立即保存
  }, [localSettings, onSave])

  return (
    <div className="h-full overflow-y-auto bg-zen-bg">
      <div className="max-w-md mx-auto w-full px-4 sm:px-6">
        {/* 固定头部 - 修复刘海屏重叠问题 */}
        <div className="sticky top-0 bg-zen-bg/95 backdrop-blur-sm z-50 pt-[env(safe-area-inset-top,0)] py-4 border-b border-zen-accent/10">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-zen-text-dim hover:text-zen-text text-lg px-2 py-1 -ml-2"
            >
              ← 返回
            </button>
            <h2 className="text-xl font-semibold text-zen-text">设置</h2>
            <div className="w-12" />
          </div>
        </div>
        
        {/* 训练参数 */}
        <div className="bg-zen-bg-light rounded-2xl p-6 border border-zen-accent/10 mt-6 mb-6">
          <h3 className="text-zen-text font-medium mb-4">训练参数</h3>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm text-zen-text-dim mb-2">
                <span>每轮呼吸次数</span>
                <span className="text-zen-accent font-medium">{localSettings.breathsPerRound}</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={localSettings.breathsPerRound}
                onChange={(e) => updateSetting('breathsPerRound', Number(e.target.value))}
                className="w-full accent-zen-accent"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-zen-text-dim mb-2">
                <span>训练轮数</span>
                <span className="text-zen-accent font-medium">{localSettings.totalRounds}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={localSettings.totalRounds}
                onChange={(e) => updateSetting('totalRounds', Number(e.target.value))}
                className="w-full accent-zen-accent"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-zen-text-dim mb-2">
                <span>恢复呼吸时间</span>
                <span className="text-zen-accent font-medium">{localSettings.recoveryTime}秒</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={localSettings.recoveryTime}
                onChange={(e) => updateSetting('recoveryTime', Number(e.target.value))}
                className="w-full accent-zen-accent"
              />
            </div>
          </div>
        </div>

        {/* 反馈设置 */}
        <div className="bg-zen-bg-light rounded-2xl p-6 border border-zen-accent/10 mb-6">
          <h3 className="text-zen-text font-medium mb-4">反馈设置</h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer py-2">
              <div>
                <span className="text-zen-text">声音提示</span>
                <p className="text-xs text-zen-text-dim mt-0.5">吸气/呼气时播放音效</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                className="w-6 h-6 rounded accent-zen-accent"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer py-2">
              <div>
                <span className="text-zen-text">振动反馈</span>
                <p className="text-xs text-zen-text-dim mt-0.5">呼吸切换时振动提示</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.vibrationEnabled}
                onChange={(e) => updateSetting('vibrationEnabled', e.target.checked)}
                className="w-6 h-6 rounded accent-zen-accent"
              />
            </label>
          </div>
        </div>

        {/* 其他设置 */}
        <div className="bg-zen-bg-light rounded-2xl p-6 border border-zen-accent/10 mb-8">
          <h3 className="text-zen-text font-medium mb-4">其他</h3>
          
          <label className="flex items-center justify-between cursor-pointer py-2">
            <div>
              <span className="text-zen-text">跳过安全提示</span>
              <p className="text-xs text-zen-text-dim mt-0.5">不再显示安全警告</p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.skipSafetyWarning}
              onChange={(e) => updateSetting('skipSafetyWarning', e.target.checked)}
              className="w-6 h-6 rounded accent-zen-accent"
            />
          </label>
        </div>

        {/* 提示信息 */}
        <div className="text-center text-xs text-zen-text-dim pb-4">
          所有设置已自动保存 ✓
        </div>
      </div>
    </div>
  )
}
