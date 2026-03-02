import type { Settings } from '../../utils/storage'

interface SettingsModalProps {
  settings: Settings
  onSave: (settings: Settings) => void
  onClose: () => void
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSave({
      breathsPerRound: Number(formData.get('breathsPerRound')),
      totalRounds: Number(formData.get('totalRounds')),
      recoveryTime: Number(formData.get('recoveryTime')),
      soundEnabled: formData.get('soundEnabled') === 'on',
      vibrationEnabled: formData.get('vibrationEnabled') === 'on',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-zen-bg-light rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zen-accent/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-zen-text">设置</h2>
          <button
            onClick={onClose}
            className="text-zen-text-dim hover:text-zen-text text-2xl"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-5">
          {/* 呼吸次数 */}
          <div>
            <label className="block text-sm text-zen-text-dim mb-2">
              每轮呼吸次数
            </label>
            <input
              type="number"
              name="breathsPerRound"
              min="10"
              max="50"
              value={settings.breathsPerRound}
              onChange={() => {}}
              className="w-full bg-zen-bg border border-zen-accent/20 rounded-xl px-4 py-3 text-zen-text focus:outline-none focus:border-zen-accent"
            />
          </div>

          {/* 训练轮数 */}
          <div>
            <label className="block text-sm text-zen-text-dim mb-2">
              训练轮数
            </label>
            <input
              type="number"
              name="totalRounds"
              min="1"
              max="10"
              value={settings.totalRounds}
              onChange={() => {}}
              className="w-full bg-zen-bg border border-zen-accent/20 rounded-xl px-4 py-3 text-zen-text focus:outline-none focus:border-zen-accent"
            />
          </div>

          {/* 恢复时间 */}
          <div>
            <label className="block text-sm text-zen-text-dim mb-2">
              恢复呼吸时间（秒）
            </label>
            <input
              type="number"
              name="recoveryTime"
              min="5"
              max="30"
              value={settings.recoveryTime}
              onChange={() => {}}
              className="w-full bg-zen-bg border border-zen-accent/20 rounded-xl px-4 py-3 text-zen-text focus:outline-none focus:border-zen-accent"
            />
          </div>

          {/* 开关选项 */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-zen-text">声音提示</span>
              <input
                type="checkbox"
                name="soundEnabled"
                defaultChecked={settings.soundEnabled}
                className="w-5 h-5 rounded accent-zen-accent"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-zen-text">振动反馈</span>
              <input
                type="checkbox"
                name="vibrationEnabled"
                defaultChecked={settings.vibrationEnabled}
                className="w-5 h-5 rounded accent-zen-accent"
              />
            </label>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-zen-bg border border-zen-accent/20 
                         text-zen-text-dim rounded-xl transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                         text-zen-accent rounded-xl transition-colors font-medium"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
