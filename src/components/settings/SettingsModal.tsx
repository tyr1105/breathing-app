import type { Settings } from '../../utils/storage'

interface SettingsModalProps {
  settings: Settings
  onSave: (settings: Settings) => void
  onClose: () => void
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSave({
      breathsPerRound: Number(formData.get('breathsPerRound')),
      totalRounds: Number(formData.get('totalRounds')),
      recoveryTime: Number(formData.get('recoveryTime')),
      soundEnabled: formData.get('soundEnabled') === 'on',
      vibrationEnabled: formData.get('vibrationEnabled') === 'on',
      skipSafetyWarning: formData.get('skipSafetyWarning') === 'on',
    })
  }

  return (
    <div className="min-h-screen bg-zen-bg p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="text-zen-text-dim hover:text-zen-text text-lg"
          >
            ← 返回
          </button>
          <h2 className="text-xl font-semibold text-zen-text">设置</h2>
          <div className="w-12" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 训练参数 */}
          <div className="bg-zen-bg-light rounded-2xl p-6 border border-zen-accent/10">
            <h3 className="text-zen-text font-medium mb-4">训练参数</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm text-zen-text-dim mb-2">
                  <span>每轮呼吸次数</span>
                  <span className="text-zen-accent">{settings.breathsPerRound}</span>
                </label>
                <input
                  type="range"
                  name="breathsPerRound"
                  min="10"
                  max="50"
                  step="5"
                  defaultValue={settings.breathsPerRound}
                  className="w-full accent-zen-accent"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm text-zen-text-dim mb-2">
                  <span>训练轮数</span>
                  <span className="text-zen-accent">{settings.totalRounds}</span>
                </label>
                <input
                  type="range"
                  name="totalRounds"
                  min="1"
                  max="10"
                  defaultValue={settings.totalRounds}
                  className="w-full accent-zen-accent"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm text-zen-text-dim mb-2">
                  <span>恢复呼吸时间</span>
                  <span className="text-zen-accent">{settings.recoveryTime}秒</span>
                </label>
                <input
                  type="range"
                  name="recoveryTime"
                  min="5"
                  max="30"
                  step="5"
                  defaultValue={settings.recoveryTime}
                  className="w-full accent-zen-accent"
                />
              </div>
            </div>
          </div>

          {/* 反馈设置 */}
          <div className="bg-zen-bg-light rounded-2xl p-6 border border-zen-accent/10">
            <h3 className="text-zen-text font-medium mb-4">反馈设置</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div>
                  <span className="text-zen-text">声音提示</span>
                  <p className="text-xs text-zen-text-dim mt-0.5">吸气/呼气时播放音效</p>
                </div>
                <input
                  type="checkbox"
                  name="soundEnabled"
                  defaultChecked={settings.soundEnabled}
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
                  name="vibrationEnabled"
                  defaultChecked={settings.vibrationEnabled}
                  className="w-6 h-6 rounded accent-zen-accent"
                />
              </label>
            </div>
          </div>

          {/* 其他设置 */}
          <div className="bg-zen-bg-light rounded-2xl p-6 border border-zen-accent/10">
            <h3 className="text-zen-text font-medium mb-4">其他</h3>
            
            <label className="flex items-center justify-between cursor-pointer py-2">
              <div>
                <span className="text-zen-text">跳过安全提示</span>
                <p className="text-xs text-zen-text-dim mt-0.5">不再显示安全警告</p>
              </div>
              <input
                type="checkbox"
                name="skipSafetyWarning"
                defaultChecked={settings.skipSafetyWarning}
                className="w-6 h-6 rounded accent-zen-accent"
              />
            </label>
          </div>

          {/* 保存按钮 */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                       text-zen-accent rounded-2xl transition-all font-medium text-lg"
          >
            保存设置
          </button>
        </form>
      </div>
    </div>
  )
}
